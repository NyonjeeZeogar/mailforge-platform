import { Star, Paperclip } from "lucide-react";
import { format } from "date-fns";

export default function MessageList({ messages, selectedId, onSelect }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No messages in this folder
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {messages.map((msg) => (
        <button
          key={msg.id}
          onClick={() => onSelect(msg)}
          className={`
            w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors
            ${selectedId === msg.id ? "bg-primary/5 border-l-2 border-primary" : ""}
            ${!msg.is_read ? "bg-primary/[0.02]" : ""}
          `}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm truncate ${!msg.is_read ? "font-semibold" : "font-medium"}`}>
                  {msg.from_name || msg.from_address}
                </p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {msg.message_date ? format(new Date(msg.message_date), "MMM d") : ""}
                </span>
              </div>
              <p className={`text-sm truncate mt-0.5 ${!msg.is_read ? "font-medium" : "text-muted-foreground"}`}>
                {msg.subject || "(No subject)"}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {msg.body_preview || ""}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1 pt-0.5">
              {msg.is_starred && <Star className="w-3.5 h-3.5 text-warning fill-warning" />}
              {msg.has_attachments && <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />}
              {!msg.is_read && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
