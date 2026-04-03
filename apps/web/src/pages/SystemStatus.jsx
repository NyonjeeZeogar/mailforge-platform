import { Activity, Server, Database, HardDrive, Cpu, MemoryStick, Wifi, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const queueData = [
  { name: "send_mail", pending: 23, processing: 5, failed: 1 },
  { name: "webhook", pending: 12, processing: 3, failed: 0 },
  { name: "dns_verify", pending: 4, processing: 1, failed: 0 },
  { name: "spam_scan", pending: 45, processing: 12, failed: 2 },
  { name: "indexing", pending: 89, processing: 15, failed: 0 },
  { name: "import", pending: 3, processing: 1, failed: 0 },
];

const performanceData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  cpu: 20 + Math.random() * 40,
  memory: 40 + Math.random() * 25,
  requests: Math.floor(100 + Math.random() * 400),
}));

const infrastructure = [
  { name: "PostgreSQL Primary", status: "healthy", metric: "Connections: 42/200", icon: Database },
  { name: "Redis Cluster", status: "healthy", metric: "Memory: 2.1 GB / 8 GB", icon: Server },
  { name: "OpenSearch", status: "healthy", metric: "Docs: 2.4M | Shards: 5", icon: Database },
  { name: "S3 Storage", status: "healthy", metric: "2.4 TB used", icon: HardDrive },
  { name: "Postfix MTA", status: "healthy", metric: "Queue: 23 msgs", icon: Server },
  { name: "Dovecot IMAP", status: "healthy", metric: "Active: 156 sessions", icon: Server },
  { name: "Rspamd", status: "healthy", metric: "Scanned: 1.2K/hr", icon: Activity },
  { name: "BullMQ Workers", status: "healthy", metric: "8 workers active", icon: Cpu },
];

export default function SystemStatus() {
  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">System Status</h1>
        <p className="text-muted-foreground mt-1">Infrastructure monitoring and job queues</p>
      </div>

      {/* Infrastructure Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {infrastructure.map((item) => (
          <div key={item.name} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-success/10">
                <item.icon className="w-4 h-4 text-success" />
              </div>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">{item.metric}</p>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-1">System Performance</h3>
        <p className="text-sm text-muted-foreground mb-6">CPU, memory, and request throughput over 24h</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" interval={3} />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
            <Tooltip
              contentStyle={{
                background: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 13%, 91%)",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="cpu" stroke="hsl(250, 65%, 55%)" strokeWidth={2} dot={false} name="CPU %" />
            <Line type="monotone" dataKey="memory" stroke="hsl(173, 58%, 39%)" strokeWidth={2} dot={false} name="Memory %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Job Queues */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-1">Job Queues (BullMQ)</h3>
        <p className="text-sm text-muted-foreground mb-6">Background job processing status</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Queue</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Pending</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Processing</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Failed</th>
              </tr>
            </thead>
            <tbody>
              {queueData.map((q) => (
                <tr key={q.name} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono font-medium">{q.name}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-warning font-medium">{q.pending}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-primary font-medium">{q.processing}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${q.failed > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                      {q.failed}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
