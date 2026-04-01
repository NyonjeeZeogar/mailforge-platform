import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";

export default function ComposeDialog({ open, onOpenChange }) {
  const [form, setForm] = useState({ to: "", cc: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    // Simulate sending delay
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    onOpenChange(false);
    setForm({ to: "", cc: "", subject: "", body: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs">To</Label>
            <Input
              placeholder="recipient@example.com"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">CC</Label>
            <Input
              placeholder="cc@example.com"
              value={form.cc}
              onChange={(e) => setForm({ ...form, cc: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Subject</Label>
            <Input
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Message</Label>
            <Textarea
              placeholder="Write your message..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={10}
              className="resize-none"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Paperclip className="w-4 h-4" /> Attach
            </Button>
            <Button onClick={handleSend} disabled={sending} className="gap-2">
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
