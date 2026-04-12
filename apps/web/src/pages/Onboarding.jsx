import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Globe,
  Mail,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Copy,
  Check,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api } from "../lib/api";

const STEPS = [
  { id: 1, label: "Organization", icon: Building2, description: "Name your workspace" },
  { id: 2, label: "Domain", icon: Globe, description: "Your email domain" },
  { id: 3, label: "DNS Setup", icon: Server, description: "Point your DNS records" },
  { id: 4, label: "Mailbox", icon: Mail, description: "First email address" },
  { id: 5, label: "Complete", icon: CheckCircle, description: "You're ready to go" },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [domain, setDomain] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const dnsRecords = [
    {
      type: "MX",
      purpose: "Mail delivery",
      name: domain || "yourdomain.com",
      value: "10 mail.espprovider.com",
    },
    {
      type: "TXT",
      purpose: "SPF",
      name: domain || "yourdomain.com",
      value: "v=spf1 include:spf.espprovider.com ~all",
    },
    {
      type: "CNAME",
      purpose: "DKIM",
      name: `dkim._domainkey.${domain || "yourdomain.com"}`,
      value: "dkim.espprovider.com",
    },
    {
      type: "TXT",
      purpose: "DMARC",
      name: `_dmarc.${domain || "yourdomain.com"}`,
      value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@espprovider.com",
    },
  ];

  const canAdvance = () => {
    if (step === 1) return orgName.trim().length > 0;
    if (step === 2) return domain.trim().length > 0;
    if (step === 4) {
      return (
        username.trim().length > 0 &&
        displayName.trim().length > 0 &&
        password.trim().length > 0
      );
    }
    return true;
  };

  const handleFinish = async () => {
    try {
      setSaving(true);
      setErrorMessage("");

      const org = await api.post("/organizations", {
        name: orgName.trim(),
      });

      const createdDomain = await api.post("/domains", {
        name: domain.trim(),
        organizationId: org.id,
      });

      await api.post("/mailboxes", {
        localPart: username.trim(),
        domainId: createdDomain.id,
        password: password.trim(),
        displayName: displayName.trim(),
      });

      setSaving(false);
      navigate("/");
    } catch (error) {
      setSaving(false);
      setErrorMessage(error.message || "Failed to complete onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm">ESP Provider</span>
        </div>
        <span className="text-xs text-muted-foreground">
          Step {step} of {STEPS.length}
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="flex items-center justify-center mb-10">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`
                      relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                      ${step > s.id ? "bg-green-600 text-white" : ""}
                      ${step === s.id ? "bg-primary text-white ring-4 ring-primary/20" : ""}
                      ${step < s.id ? "bg-muted text-muted-foreground" : ""}
                    `}
                  >
                    {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`hidden sm:block text-[10px] font-medium tracking-wide
                      ${step === s.id ? "text-primary" : step > s.id ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {s.label}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div
                    className={`w-10 sm:w-16 h-0.5 mx-2 mb-4 rounded-full
                      ${step > s.id ? "bg-green-600" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-xl shadow-black/5 overflow-hidden">
            <div
              className="h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/20"
              style={{
                width: `${(step / STEPS.length) * 100}%`,
                transition: "width 0.4s ease",
              }}
            />

            <div className="p-8 sm:p-10">
              <StepContent
                step={step}
                orgName={orgName}
                setOrgName={setOrgName}
                domain={domain}
                setDomain={setDomain}
                dnsRecords={dnsRecords}
                username={username}
                setUsername={setUsername}
                displayName={displayName}
                setDisplayName={setDisplayName}
                password={password}
                setPassword={setPassword}
              />
            </div>

            <div className="px-8 sm:px-10 py-5 border-t border-border bg-muted/30 flex items-center justify-between">
              {step > 1 && step < 5 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep((s) => s - 1)}
                  className="gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </Button>
              ) : (
                <div />
              )}

              {step < 4 && (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canAdvance()}
                  className="gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              )}

              {step === 4 && (
                <Button
                  onClick={() => setStep(5)}
                  disabled={!canAdvance()}
                  className="gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              )}

              {step === 5 && (
                <Button
                  onClick={handleFinish}
                  disabled={saving}
                  className="gap-2 px-6"
                >
                  {saving ? "Setting up…" : "Go to Dashboard"}
                  {!saving && <ArrowRight className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : null}

          {step < 5 && (
            <p className="text-center text-xs text-muted-foreground mt-5">
              You can always change these settings later from the dashboard.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StepContent({
  step,
  orgName,
  setOrgName,
  domain,
  setDomain,
  dnsRecords,
  username,
  setUsername,
  displayName,
  setDisplayName,
  password,
  setPassword,
}) {
  if (step === 1)
    return (
      <div className="space-y-7">
        <StepHeader
          icon={Building2}
          title="Create your organization"
          subtitle="This is the name of your company or team workspace."
        />

        <div className="space-y-2">
          <Label>Organization name</Label>
          <Input
            placeholder="e.g. Acme Corp"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="h-11 text-base"
            autoFocus
          />
        </div>

        <FeatureHighlights
          items={[
            "Manage multiple domains under one org",
            "Invite team members and assign roles",
            "Centralized billing and usage reporting",
          ]}
        />
      </div>
    );

  if (step === 2)
    return (
      <div className="space-y-7">
        <StepHeader
          icon={Globe}
          title="Add your domain"
          subtitle="Enter the domain you want to use for sending and receiving email."
        />

        <div className="space-y-2">
          <Label>Domain name</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="example.com"
              value={domain}
              onChange={(e) =>
                setDomain(e.target.value.toLowerCase().replace(/\s/g, ""))
              }
              className="h-11 pl-9 text-base font-mono"
              autoFocus
            />
          </div>
        </div>

        <FeatureHighlights
          items={[
            "Custom branded email addresses",
            "Full DNS verification (MX, SPF, DKIM, DMARC)",
            "Domain-level catch-all routing",
          ]}
        />
      </div>
    );

  if (step === 3)
    return (
      <div className="space-y-6">
        <StepHeader
          icon={Server}
          title="Configure DNS records"
          subtitle={`Add these records in your DNS provider for ${domain || "your domain"} to start receiving mail.`}
        />

        <div className="space-y-2.5">
          {dnsRecords.map((r, i) => (
            <DnsRow key={i} record={r} />
          ))}
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm">
          <ShieldCheck className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
          <p className="text-muted-foreground leading-relaxed">
            DNS changes can take time to propagate. You can continue now and
            verify later from the Domains page.
          </p>
        </div>
      </div>
    );

  if (step === 4)
    return (
      <div className="space-y-7">
        <StepHeader
          icon={Mail}
          title="Create your first mailbox"
          subtitle="Set up your primary email address on this domain."
        />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Your name</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="e.g. Alex Johnson"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-11 pl-9"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email address</Label>
            <div className="flex items-center gap-0">
              <Input
                placeholder="alex"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, "")
                  )
                }
                className="h-11 rounded-r-none font-mono z-10"
              />
              <div className="h-11 flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md text-sm text-muted-foreground font-mono whitespace-nowrap">
                @{domain || "domain.com"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mailbox password</Label>
            <Input
              type="password"
              placeholder="Create a secure mailbox password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </div>
    );

  if (step === 5)
    return (
      <div className="text-center space-y-6 py-6">
        <div className="relative inline-flex">
          <div className="w-20 h-20 rounded-2xl bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">You're all set!</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            Your email platform is ready. Head to the dashboard to verify DNS,
            manage mailboxes, and continue setup.
          </p>
        </div>
      </div>
    );

  return null;
}

function StepHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function FeatureHighlights({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-center gap-2.5 text-sm text-muted-foreground"
        >
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-primary" />
          </div>
          {item}
        </li>
      ))}
    </ul>
  );
}

function DnsRow({ record }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(record.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typeColors = {
    MX: "bg-blue-500/10 text-blue-600",
    TXT: "bg-purple-500/10 text-purple-600",
    CNAME: "bg-orange-500/10 text-orange-600",
  };

  return (
    <div className="group flex items-start gap-3 p-3.5 rounded-xl bg-muted/40 border border-border hover:border-border/80 hover:bg-muted/60 transition-all">
      <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-md ${
              typeColors[record.type] || "bg-muted text-muted-foreground"
            }`}
          >
            {record.type}
          </span>
          <span className="text-xs text-muted-foreground">
            {record.purpose}
          </span>
        </div>
        <p className="text-xs font-mono text-muted-foreground truncate max-w-full">
          {record.name}
        </p>
        <p className="text-xs font-mono text-foreground break-all leading-relaxed">
          {record.value}
        </p>
      </div>

      <button
        onClick={handleCopy}
        className="mt-1 p-1.5 rounded-lg hover:bg-background border border-transparent hover:border-border transition-all text-muted-foreground hover:text-foreground shrink-0"
        title="Copy value"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-600" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
