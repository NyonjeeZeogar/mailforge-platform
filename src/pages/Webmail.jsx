import { useState } from "react";
import { Inbox, Send, FileText, Trash2, AlertTriangle, Archive, Search, Pencil, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MessageList from "../components/webmail/MessageList";
import MessageView from "../components/webmail/MessageView";
import ComposeDialog from "../components/webmail/ComposeDialog";

const folders = [
  { key: "inbox", label: "Inbox", icon: Inbox },
  { key: "sent", label: "Sent", icon: Send },
  { key: "drafts", label: "Drafts", icon: FileText },
  { key: "archive", label: "Archive", icon: Archive },
  { key: "spam", label: "Spam", icon: AlertTriangle },
  { key: "trash", label: "Trash", icon: Trash2 },
];

export default function Webmail() {
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);

  const { data: messages, isLoading, refetch } = useQuery({
    queryKey: ["emails", activeFolder],
    queryFn: () => base44.entities.EmailMessage.filter({ folder: activeFolder }, "-created_date", 50),
  });

  const filtered = messages?.filter(
    (m) =>
      m.subject?.toLowerCase().includes(search.toLowerCase()) ||
      m.from_address?.toLowerCase().includes(search.toLowerCase()) ||
      m.body_preview?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const inboxCount = messages?.filter((m) => !m.is_read).length || 0;

  return (
    <div className="flex h-[calc(100vh-64px)] animate-fade-in">
      {/* Folder Sidebar */}
      <div className="w-56 border-r border-border bg-card flex-shrink-0 hidden md:flex flex-col">
        <div className="p-3">
          <Button onClick={() => setComposeOpen(true)} className="w-full gap-2">
            <Pencil className="w-4 h-4" /> Compose
          </Button>
        </div>
        <nav className="flex-1 px-2 space-y-0.5">
          {folders.map((f) => (
            <button
              key={f.key}
              onClick={() => { setActiveFolder(f.key); setSelectedMessage(null); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${activeFolder === f.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}
              `}
            >
              <f.icon className="w-4 h-4" />
              <span className="flex-1 text-left">{f.label}</span>
              {f.key === "inbox" && inboxCount > 0 && (
                <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">
                  {inboxCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Message List */}
      <div className={`w-full md:w-96 border-r border-border flex flex-col bg-card ${selectedMessage ? "hidden md:flex" : "flex"}`}>
        <div className="p-3 border-b border-border flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <MessageList messages={filtered} selectedId={selectedMessage?.id} onSelect={setSelectedMessage} />
          )}
        </div>
        {/* Mobile folder nav */}
        <div className="md:hidden border-t border-border flex items-center overflow-x-auto px-2 py-1.5">
          <Button size="sm" variant="ghost" onClick={() => setComposeOpen(true)} className="shrink-0">
            <Pencil className="w-4 h-4" />
          </Button>
          {folders.map((f) => (
            <button
              key={f.key}
              onClick={() => { setActiveFolder(f.key); setSelectedMessage(null); }}
              className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeFolder === f.key ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message View */}
      <div className={`flex-1 bg-background ${selectedMessage ? "flex" : "hidden md:flex"} flex-col`}>
        {selectedMessage && (
          <button
            onClick={() => setSelectedMessage(null)}
            className="md:hidden p-3 text-sm text-primary font-medium border-b border-border"
          >
            ← Back to messages
          </button>
        )}
        <div className="flex-1">
          <MessageView message={selectedMessage} />
        </div>
      </div>

      <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen} />
    </div>
  );
}
