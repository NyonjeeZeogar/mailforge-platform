import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Globe, Mail, Building2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { label: "Create organization", icon: Building2 },
  { label: "Add domain", icon: Globe },
  { label: "Verify DNS", icon: CheckCircle2 },
  { label: "Create mailbox", icon: Mail },
];

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl animate-fade-in space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Getting Started
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to MailForge</h1>
          <p className="text-muted-foreground mt-2">
            Base44 has been removed from onboarding. This flow will be reconnected to your Nest API next.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step) => (
            <div key={step.label} className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">{step.label}</h2>
                  <p className="text-sm text-muted-foreground">Pending API integration</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-6 text-center space-y-4">
          <h2 className="text-xl font-semibold">Next recommended flow</h2>
          <p className="text-sm text-muted-foreground">
            Use the Domains page to continue the control-plane migration, then return here once
            organizations, domains, DNS verification, and mailboxes are all connected to the backend.
          </p>
          <Button onClick={() => navigate("/domains")} className="gap-2">
            Go to Domains
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
