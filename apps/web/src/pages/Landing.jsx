import { Link } from "react-router-dom";
import {
  Zap,
  Globe,
  Mail,
  Shield,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle,
  Server,
  Lock,
  Inbox,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Globe,
    title: "Custom Domain Email",
    description:
      "Send and receive email on your own domain. Full DNS setup with MX, SPF, DKIM, and DMARC in minutes.",
  },
  {
    icon: Shield,
    title: "Built-in Anti-Spam",
    description:
      "Rspamd-powered filtering keeps your inbox clean and your sender reputation strong.",
  },
  {
    icon: Server,
    title: "Reliable Delivery",
    description:
      "Enterprise-grade mail infrastructure with real-time delivery monitoring.",
  },
  {
    icon: Inbox,
    title: "Webmail Included",
    description:
      "A fast, clean webmail client so your team can access email from any browser.",
  },
  {
    icon: Users,
    title: "Team Mailboxes",
    description:
      "Personal, shared, group, and alias mailboxes with centralized admin controls.",
  },
  {
    icon: BarChart3,
    title: "Mail Analytics",
    description:
      "Track sent, received, bounced, and spam metrics with a real-time dashboard.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$9",
    per: "/ mo",
    description: "For small teams getting started with custom email.",
    features: [
      "5 mailboxes",
      "1 domain",
      "25 GB storage",
      "Webmail access",
      "Basic analytics",
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Business",
    price: "$29",
    per: "/ mo",
    description: "For growing teams that need reliability and scale.",
    features: [
      "50 mailboxes",
      "5 domains",
      "360 GB storage",
      "Priority delivery",
      "Full analytics",
      "Aliases & catch-all",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "",
    description: "For organizations with advanced compliance needs.",
    features: [
      "Unlimited mailboxes",
      "Unlimited domains",
      "Dedicated IP",
      "SLA guarantee",
      "SSO & SCIM",
      "Dedicated support",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Migrating from Google Workspace took less than a day. The DNS setup wizard is genuinely the best I've used.",
    name: "Sarah Chen",
    role: "CTO at Acme Corp",
    avatar: "SC",
  },
  {
    quote:
      "We manage 12 domains across our portfolio companies. This is the only platform that makes that sane.",
    name: "Marcus Reid",
    role: "Partner, Venture Studio",
    avatar: "MR",
  },
  {
    quote:
      "Our support team lives in the shared mailboxes. The webmail is fast and the spam filtering is excellent.",
    name: "Priya Nair",
    role: "Head of Ops at TechCorp",
    avatar: "PN",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">MailForge</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">
              Customers
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button size="sm" className="gap-1.5">
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-24 pb-28 px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/3 w-[400px] h-[300px] bg-primary/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5" /> Hosted Email for Modern Teams
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Email infrastructure
            <br />
            <span className="text-primary">without the headaches</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            Custom domain email, reliable delivery, spam filtering, and a clean
            control panel — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/onboarding">
              <Button size="lg" className="gap-2 px-8 text-base h-12 shadow-lg shadow-primary/25">
                Start for free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/">
              <Button variant="outline" size="lg" className="gap-2 px-8 text-base h-12">
                View dashboard
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-5">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 overflow-hidden">
            <div className="h-8 bg-muted/60 border-b border-border flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 h-5 bg-background/60 rounded-md mx-4 flex items-center px-3">
                <span className="text-[10px] text-muted-foreground font-mono">
                  app.mailforge.com
                </span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Active Mailboxes", value: "247", color: "text-primary" },
                { label: "Domains Verified", value: "18", color: "text-green-600" },
                { label: "Emails Today", value: "14.2k", color: "text-foreground" },
                { label: "Delivery Rate", value: "99.8%", color: "text-green-600" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-muted/40 rounded-xl p-4 border border-border/50"
                >
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 grid grid-cols-3 gap-3">
              {["acme.com", "techcorp.io", "startup.dev"].map((d, i) => (
                <div
                  key={d}
                  className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2.5 border border-border/40"
                >
                  <div className={`w-2 h-2 rounded-full ${i === 2 ? "bg-yellow-500" : "bg-green-600"}`} />
                  <span className="text-xs font-mono text-foreground">{d}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {i === 2 ? "pending" : "verified"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 bg-muted/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Everything you need to run email
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete hosted email stack with the management UI you actually want to use.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group bg-card rounded-2xl border border-border p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Up and running in minutes
          </h2>
          <p className="text-muted-foreground mb-14">
            Three steps from sign-up to receiving email on your domain.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: Users,
                title: "Create your org",
                desc: "Sign up, name your organization, and start setup.",
              },
              {
                step: "02",
                icon: Globe,
                title: "Add your domain",
                desc: "Enter your domain. We generate the DNS records you need.",
              },
              {
                step: "03",
                icon: Mail,
                title: "Create mailboxes",
                desc: "Add mailboxes and start receiving email after DNS setup.",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="absolute top-4 right-4 text-5xl font-black text-muted/40 leading-none select-none">
                  {step}
                </span>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 px-6 bg-muted/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Loved by teams everywhere
            </h2>
            <p className="text-muted-foreground">
              Real feedback from customers who've made the switch.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ quote, name, role, avatar }) => (
              <div
                key={name}
                className="bg-card rounded-2xl border border-border p-6 flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  "{quote}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground">
              Start free. Scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 items-start">
            {PLANS.map(({ name, price, per, description, features, cta, highlight }) => (
              <div
                key={name}
                className={`relative rounded-2xl border p-7 flex flex-col gap-5 ${
                  highlight
                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                    : "border-border bg-card"
                }`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary rounded-full text-xs font-bold text-white shadow">
                    Most popular
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-lg">{name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{description}</p>
                </div>

                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">{price}</span>
                  <span className="text-muted-foreground text-sm mb-1">{per}</span>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/onboarding">
                  <Button
                    className="w-full gap-1.5"
                    variant={highlight ? "default" : "outline"}
                  >
                    {cta} <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-6 h-6 text-primary" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to own your email?
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Join teams that have moved off unreliable providers and get set up fast.
            </p>

            <Link to="/onboarding">
              <Button size="lg" className="gap-2 px-10 text-base h-12 shadow-lg shadow-primary/25">
                Start your free trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <p className="text-xs text-muted-foreground mt-4">
              No credit card · 14-day trial · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm">MailForge</span>
          </div>

          <p className="text-xs text-muted-foreground">
            © 2026 MailForge. All rights reserved.
          </p>

          <div className="flex gap-5 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Status
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
