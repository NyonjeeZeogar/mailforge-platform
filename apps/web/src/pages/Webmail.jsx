import { Inbox, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Webmail() {
  return (
    <div className="flex h-[calc(100vh-64px)] animate-fade-in">
      <div className="w-56 border-r border-border bg-card flex-shrink-0 hidden md:flex flex-col">
        <div className="p-3">
          <Button disabled className="w-full gap-2">
            <Pencil className="w-4 h-4" />
            Compose
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Inbox className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Webmail is not connected yet</h1>
          <p className="text-sm text-muted-foreground">
            The Base44 email message dependency has been removed. Reconnect this page after your
            mailbox and message APIs are available.
          </p>
        </div>
      </div>
    </div>
  );
}
