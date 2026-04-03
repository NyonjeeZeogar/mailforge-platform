import { CheckCircle, XCircle, Clock, AlertTriangle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  verified: { label: "Verified", icon: CheckCircle, class: "bg-success/10 text-success border-success/20" },
  pending: { label: "Pending", icon: Clock, class: "bg-warning/10 text-warning border-warning/20" },
  verifying: { label: "Verifying", icon: RefreshCw, class: "bg-primary/10 text-primary border-primary/20" },
  failed: { label: "Failed", icon: XCircle, class: "bg-destructive/10 text-destructive border-destructive/20" },
  suspended: { label: "Suspended", icon: AlertTriangle, class: "bg-muted text-muted-foreground border-muted" },
};

export default function DomainCard({ domain, onVerify }) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[domain.status] || statusConfig.pending;
  const StatusIconComponent = config.icon;

  const dnsChecks = [
    { label: "MX", verified: domain.mx_verified },
    { label: "SPF", verified: domain.spf_verified },
    { label: "DKIM", verified: domain.dkim_verified },
    { label: "DMARC", verified: domain.dmarc_verified },
  ];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{domain.domain_name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {domain.catch_all_enabled ? `Catch-all → ${domain.catch_all_target || "enabled"}` : "No catch-all"}
            </p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.class}`}>
            <StatusIconComponent className="w-3 h-3" />
            {config.label}
          </div>
        </div>

        {/* DNS Checks */}
        <div className="flex items-center gap-3 mt-4">
          {dnsChecks.map((check) => (
            <div key={check.label} className="flex items-center gap-1.5">
              {check.verified ? (
                <CheckCircle className="w-3.5 h-3.5 text-success" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <span className="text-xs font-medium text-muted-foreground">{check.label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          {domain.status !== "verified" && (
            <button
              onClick={() => onVerify?.(domain)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Verify DNS
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors flex items-center gap-1"
          >
            DNS Records
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border p-4 bg-muted/20 space-y-2 animate-fade-in">
          <DnsHint type="MX" name={domain.domain_name} value={`10 mail.${domain.domain_name}`} />
          <DnsHint type="TXT" name={domain.domain_name} value={`v=spf1 include:spf.espprovider.com ~all`} />
          <DnsHint type="CNAME" name={`dkim._domainkey.${domain.domain_name}`} value="dkim.espprovider.com" />
          <DnsHint type="TXT" name={`_dmarc.${domain.domain_name}`} value="v=DMARC1; p=quarantine; rua=mailto:dmarc@espprovider.com" />
        </div>
      )}
    </div>
  );
}

function DnsHint({ type, name, value }) {
  const handleCopy = () => navigator.clipboard.writeText(value);
  return (
    <div className="flex items-center gap-3 text-xs p-2 rounded-md bg-card">
      <span className="font-mono font-bold text-primary w-12">{type}</span>
      <span className="font-mono text-muted-foreground truncate flex-1">{name}</span>
      <span className="font-mono truncate flex-1">{value}</span>
      <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
        Copy
      </button>
    </div>
  );
}
