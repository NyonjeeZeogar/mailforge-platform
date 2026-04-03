import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", sent: 2400, received: 1800, bounced: 40 },
  { name: "Tue", sent: 3200, received: 2400, bounced: 55 },
  { name: "Wed", sent: 2800, received: 2100, bounced: 32 },
  { name: "Thu", sent: 3500, received: 2600, bounced: 48 },
  { name: "Fri", sent: 4100, received: 3200, bounced: 62 },
  { name: "Sat", sent: 1800, received: 1200, bounced: 18 },
  { name: "Sun", sent: 1200, received: 900, bounced: 12 },
];

export default function MailChart() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Mail Traffic</h3>
          <p className="text-sm text-muted-foreground">Last 7 days overview</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Sent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-2" />
            <span className="text-xs text-muted-foreground">Received</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">Bounced</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(250, 65%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(250, 65%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="recvGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
          <Tooltip
            contentStyle={{
              background: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(220, 13%, 91%)",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Area type="monotone" dataKey="sent" stroke="hsl(250, 65%, 55%)" fill="url(#sentGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="received" stroke="hsl(173, 58%, 39%)" fill="url(#recvGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="bounced" stroke="hsl(0, 84%, 60%)" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
