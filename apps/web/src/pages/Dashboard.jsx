import { Mail, Globe, Users, Shield, Send, Inbox, AlertTriangle, HardDrive } from "lucide-react";
import StatsCard from "../components/dashboard/StatsCard";
import MailChart from "../components/dashboard/MailChart";
import SystemHealth from "../components/dashboard/SystemHealth";
import RecentActivity from "../components/dashboard/RecentActivity";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { data: orgs } = useQuery({
    queryKey: ["orgs"],
    queryFn: () => base44.entities.Organization.list(),
  });
  const { data: domains } = useQuery({
    queryKey: ["domains"],
    queryFn: () => base44.entities.Domain.list(),
  });
  const { data: mailboxes } = useQuery({
    queryKey: ["mailboxes"],
    queryFn: () => base44.entities.Mailbox.list(),
  });

  const orgCount = orgs?.length || 0;
  const domainCount = domains?.length || 0;
  const mailboxCount = mailboxes?.length || 0;
  const verifiedDomains = domains?.filter(d => d.status === "verified").length || 0;

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your ESP platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Mailboxes" value={mailboxCount} change={12.5} icon={Mail} />
        <StatsCard title="Active Domains" value={domainCount} change={8.2} icon={Globe} />
        <StatsCard title="Organizations" value={orgCount} change={15.3} icon={Users} />
        <StatsCard title="Verified Domains" value={verifiedDomains} change={-2.1} icon={Shield} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Emails Sent Today" value="14,832" change={5.7} icon={Send} />
        <StatsCard title="Emails Received" value="23,451" change={3.2} icon={Inbox} />
        <StatsCard title="Bounce Rate" value="0.8%" change={-0.3} icon={AlertTriangle} />
        <StatsCard title="Storage Used" value="2.4 TB" change={18.4} icon={HardDrive} />
      </div>

      {/* Chart and Health */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <MailChart />
        </div>
        <div>
          <SystemHealth />
        </div>
      </div>

      {/* Activity */}
      <RecentActivity />
    </div>
  );
}
