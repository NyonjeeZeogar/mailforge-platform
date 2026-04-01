import { useState } from "react";
import { CreditCard, Check, Zap, Building2, Rocket, Users, HardDrive, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const plans = [
  {
    name: "Starter",
    slug: "starter",
    monthlyPrice: 4,
    yearlyPrice: 40,
    users: 5,
    domains: 1,
    storage: "5 GB / user",
    features: ["Custom domain email", "Webmail access", "Spam protection", "Basic support", "IMAP/POP3"],
    icon: Zap,
    popular: false,
  },
  {
    name: "Business",
    slug: "business",
    monthlyPrice: 8,
    yearlyPrice: 80,
    users: 50,
    domains: 5,
    storage: "30 GB / user",
    features: ["Everything in Starter", "Shared inboxes", "Aliases & catch-all", "Priority support", "Migration tools", "Calendar & Contacts"],
    icon: Building2,
    popular: true,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    monthlyPrice: 14,
    yearlyPrice: 140,
    users: "Unlimited",
    domains: "Unlimited",
    storage: "100 GB / user",
    features: ["Everything in Business", "SSO / SAML", "Compliance & eDiscovery", "Dedicated IP", "SLA guarantee", "Custom onboarding"],
    icon: Rocket,
    popular: false,
  },
];

export default function Billing() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="p-4 lg:p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground mt-1">Manage subscriptions and usage</p>
      </div>

      {/* Current Usage */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UsageCard icon={Users} label="Active Users" value="12" limit="50" percent={24} />
        <UsageCard icon={Globe} label="Domains" value="3" limit="5" percent={60} />
        <UsageCard icon={HardDrive} label="Storage" value="18.4 GB" limit="360 GB" percent={5} />
      </div>

      {/* Plan Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
        <Switch checked={yearly} onCheckedChange={setYearly} />
        <span className={`text-sm font-medium ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
          Yearly <span className="text-xs text-success font-medium ml-1">Save 17%</span>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.slug}
            className={`
              relative bg-card rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl
              ${plan.popular ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]" : "border-border hover:shadow-primary/5"}
            `}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                Most Popular
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl ${plan.popular ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <plan.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">${yearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                <span className="text-sm text-muted-foreground">/ user / {yearly ? "year" : "month"}</span>
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <DetailRow label="Users" value={typeof plan.users === "number" ? `Up to ${plan.users}` : plan.users} />
              <DetailRow label="Domains" value={typeof plan.domains === "number" ? `Up to ${plan.domains}` : plan.domains} />
              <DetailRow label="Storage" value={plan.storage} />
            </div>
            <div className="space-y-2.5 mb-6">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
            <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
              {plan.slug === "business" ? "Current Plan" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-muted">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">•••• •••• •••• 4242</p>
            <p className="text-xs text-muted-foreground">Expires 12/2027 · Visa</p>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto">Update</Button>
        </div>
      </div>
    </div>
  );
}

function UsageCard({ icon: Icon, label, value, limit, percent }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value} <span className="text-sm font-normal text-muted-foreground">/ {limit}</span></p>
      <Progress value={percent} className="h-1.5 mt-3" />
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
