import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const services = [
  { name: "SMTP (Postfix)", status: "healthy", latency: "12ms", uptime: "99.98%" },
  { name: "IMAP (Dovecot)", status: "healthy", latency: "8ms", uptime: "99.99%" },
  { name: "Spam Filter (Rspamd)", status: "healthy", latency: "45ms", uptime: "99.95%" },
  { name: "Virus Scanner (ClamAV)", status: "warning", latency: "120ms", uptime: "99.90%" },
  { name: "Search (OpenSearch)", status: "healthy", latency: "22ms", uptime: "99.97%" },
  { name: "Queue (BullMQ/Redis)", status: "healthy", latency: "3ms", uptime: "100%" },
  { name: "DNS Automation", status: "healthy", latency: "85ms", uptime: "99.96%" },
  { name: "Object Storage (S3)", status: "healthy", latency: "35ms", uptime: "99.99%" },
];

const StatusIcon = ({ status }) => {
  if (status === "healthy") return <CheckCircle className="w-4 h-4 text-success" />;
  if (status === "warning") return <AlertTriangle className="w-4 h-4 text-warning" />;
  return <XCircle className="w-4 h-4 text-destructive" />;
};

export default function SystemHealth() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold">System Health</h3>
          <p className="text-sm text-muted-foreground">Infrastructure status</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          All Systems Operational
        </div>
      </div>
      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <StatusIcon status={service.status} />
              <span className="text-sm font-medium">{service.name}</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>{service.latency}</span>
              <span className="w-16 text-right">{service.uptime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
