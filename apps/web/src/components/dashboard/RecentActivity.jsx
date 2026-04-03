import { Globe, Mail, Users, Shield, AlertTriangle } from "lucide-react";

const activities = [
  { icon: Globe, text: "Domain acme.com verified successfully", time: "2 min ago", type: "success" },
  { icon: Mail, text: "New mailbox john@acme.com created", time: "15 min ago", type: "info" },
  { icon: Users, text: "3 new users invited to TechCorp org", time: "1 hour ago", type: "info" },
  { icon: Shield, text: "DKIM rotation completed for startup.io", time: "2 hours ago", type: "success" },
  { icon: AlertTriangle, text: "High bounce rate detected for blast.co", time: "3 hours ago", type: "warning" },
  { icon: Mail, text: "Migration from Google Workspace completed", time: "5 hours ago", type: "success" },
  { icon: Globe, text: "Domain newco.dev DNS verification pending", time: "6 hours ago", type: "info" },
];

const typeColors = {
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  info: "text-primary bg-primary/10",
};

export default function RecentActivity() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest platform events</p>
      </div>
      <div className="space-y-3">
        {activities.map((item, i) => (
          <div key={i} className="flex items-start gap-3 py-2">
            <div className={`p-2 rounded-lg ${typeColors[item.type]}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug">{item.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
