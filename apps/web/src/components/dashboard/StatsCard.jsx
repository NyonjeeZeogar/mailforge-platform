import { ArrowUp, ArrowDown } from "lucide-react";

export default function StatsCard({ title, value, change, changeLabel, icon: Icon, color = "primary" }) {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <ArrowUp className="w-3.5 h-3.5 text-success" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5 text-destructive" />
              )}
              <span className={`text-sm font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-muted-foreground">{changeLabel || "vs last month"}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
