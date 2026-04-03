import { CheckCircle, XCircle, Copy } from "lucide-react";
import { useState } from "react";

export default function DnsRecordRow({ record }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-4 py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2 w-20">
        <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-primary/10 text-primary">
          {record.record_type}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{record.name}</p>
        <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">{record.value}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleCopy(record.value)}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          title="Copy value"
        >
          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        {record.is_verified ? (
          <CheckCircle className="w-4 h-4 text-success" />
        ) : (
          <XCircle className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
