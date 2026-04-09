import { Mail, Globe, Users, Shield, Send, Inbox, AlertTriangle, HardDrive } from "lucide-react";
import StatsCard from "../components/dashboard/StatsCard";
import MailChart from "../components/dashboard/MailChart";
import SystemHealth from "../components/dashboard/SystemHealth";
import RecentActivity from "../components/dashboard/RecentActivity";
import { useQuery } from "@tanstack/react-query";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const { data: orgs = [] } = useQuery({
    queryKey: ["orgs"],
    queryFn: async () => {
      const res = await fetch(`${API}/organizations`);
      if (!res.ok) throw new Error("Failed to fetch organizations");
      return res.json();
    },
  });

  const { data: domains = [] } = useQuery({
    queryKey: ["domains"],
    queryFn: async () => {
      const res = await fetch(`${API}/domains`);
      if (!res.ok) throw new Error("Failed to fetch domains");
      return res.json();
    },
  });

  const mailboxCount = 0; // backend mailbox endpoint not wired yet

  const orgCount = orgs.length;
  const domainCount = domains.length;
  const verifiedDomains = domains.filter(
    (d) => d.status === "VERIFIED"
  ).length;

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your ESP platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Mailboxes" value={mailboxCount} change={12.5} icon={Mail} />
        <StatsCard title="Active Domains" value={domainCount} change={8.2} icon={Globe} />
        <StatsCard title="Organizations" value={orgCount} change={15.3} icon={Users} />
        <StatsCard title="Verified Domains" value={verifiedDomains} change={-2.1} icon={Shield} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Emails Sent Today" value="14,832" change={5.7} icon={Send} />
        <StatsCard title="Emails Received" value="23,451" change={3.2} icon={Inbox} />
        <StatsCard title="Bounce Rate" value="0.8%" change={-0.3} icon={AlertTriangle} />
        <StatsCard title="Storage Used" value="2.4 TB" change={18.4} icon={HardDrive} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <MailChart />
        </div>
        <div>
          <SystemHealth />
        </div>
      </div>

      <RecentActivity />
    </div>
  );
}
