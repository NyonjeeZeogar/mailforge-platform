import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Globe, Mail, CheckCircle, ArrowRight, ArrowLeft, Zap, Copy, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const steps = [
  { id: 1, label: "Organization", icon: Building2 },
  { id: 2, label: "Domain", icon: Globe },
  { id: 3, label: "DNS Setup", icon: RefreshCw },
  { id: 4, label: "Mailbox", icon: Mail },
  { id: 5, label: "Complete", icon: CheckCircle },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const handleFinish = async () => {
    const org = await base44.entities.Organization.create({
      name: orgName, slug: orgName.toLowerCase().replace(/\s+/g, "-"),
      plan: "trial", status: "trial", max_users: 5, max_domains: 1,
      storage_used_mb: 0, storage_limit_mb: 5120,
    });
    const dom = await base44.entities.Domain.create({
      domain_name: domain, organization_id: org.id, status: "pending",
      mx_verified: false, spf_verified: false, dkim_verified: false, dmarc_verified: false,
    });
    await base44.entities.Mailbox.create({
      email: `${email}@${domain}`, display_name: displayName,
      organization_id: org.id, domain_id: dom.id, type: "personal", status: "active",
      storage_used_mb: 0, storage_limit_mb: 5120, unread_count: 0,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" /> Getting Started
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Set up your email platform</h1>
          <p className="text-muted-foreground mt-2">Complete these steps to get your custom email running</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all
                ${step > s.id ? "bg-success text-success-foreground" : step === s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
              `}>
                {step > s.id ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 sm:w-12 h-0.5 mx-1 ${step > s.id ? "bg-success" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-lg shadow-primary/5">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Create your organization</h2>
                <p className="text-sm text-muted-foreground mt-1">This will be your workspace name</p>
              </div>
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input placeholder="Acme Corp" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="text-lg py-3" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Add your domain</h2>
                <p className="text-sm text-muted-foreground mt-1">Enter the domain you want to use for email</p>
              </div>
              <div className="space-y-2">
                <Label>Domain Name</Label>
                <Input placeholder="example.com" value={domain} onChange={(e) => setDomain(e.target.value)} className="text-lg py-3" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Configure DNS records</h2>
                <p className="text-sm text-muted-foreground mt-1">Add these records to your DNS provider to verify your domain</p>
              </div>
              <div className="space-y-3">
                <DnsInstruction type="MX" name={domain || "yourdomain.com"} value={`10 mail.${domain || "yourdomain.com"}`} />
                <DnsInstruction type="TXT" name={domain || "yourdomain.com"} value="v=spf1 include:spf.espprovider.com ~all" />
                <DnsInstruction type="CNAME" name={`dkim._domainkey.${domain || "yourdomain.com"}`} value="dkim.espprovider.com" />
                <DnsInstruction type="TXT" name={`_dmarc.${domain || "yourdomain.com"}`} value="v=DMARC1; p=quarantine; rua=mailto:dmarc@espprovider.com" />
              </div>
              <p className="text-xs text-muted-foreground">DNS changes may take up to 48 hours to propagate. You can verify later from the Domains page.</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Create your first mailbox</h2>
                <p className="text-sm text-muted-foreground mt-1">Set up your primary email address</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input placeholder="John Doe" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email Username</Label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="john" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">@{domain || "domain.com"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-xl font-semibold">You're all set!</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your email platform is configured. Head to the dashboard to manage your domains, mailboxes, and settings.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {step > 1 && step < 5 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            ) : <div />}
            {step < 5 ? (
              <Button onClick={() => setStep(step + 1)} className="gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} className="gap-2 mx-auto">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DnsInstruction({ type, name, value }) {
  const handleCopy = () => navigator.clipboard.writeText(value);
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded w-14 text-center">{type}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-muted-foreground truncate">{name}</p>
        <p className="text-xs font-mono truncate">{value}</p>
      </div>
      <button onClick={handleCopy} className="p-1.5 rounded-md hover:bg-muted transition-colors">
        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}
