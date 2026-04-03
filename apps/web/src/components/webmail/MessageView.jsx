import { Reply, Forward, Trash2, Archive, Star, MoreVertical, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function MessageView({ message }) {
  if (!message) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
            <Reply className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-sm">Select a message to read</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold">{message.subject || "(No subject)"}</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {(message.from_name || message.from_address)?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{message.from_name || message.from_address}</p>
                <p className="text-xs text-muted-foreground">
                  to {message.to_addresses || "me"} · {message.message_date ? format(new Date(message.message_date), "MMM d, yyyy 'at' h:mm a") : ""}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Archive className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5">
        {message.has_attachments && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 mb-4">
            <Paperclip className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Attachments</span>
          </div>
        )}
        <div className="prose prose-sm max-w-none text-foreground">
          {message.body_html ? (
            <div dangerouslySetInnerHTML={{ __html: message.body_html }} />
          ) : (
            <p className="whitespace-pre-wrap">{message.body_preview || "No content"}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Reply className="w-4 h-4" /> Reply
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Forward className="w-4 h-4" /> Forward
        </Button>
      </div>
    </div>
  );
}
