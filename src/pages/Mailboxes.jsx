import { useState } from "react";
import { Plus, Search, Mail, MoreVertical, Shield, Forward, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const typeStyles = {
  personal: "bg-primary/10 text-primary",
  shared: "bg-chart-2/20 text-chart-2",
  alias: "bg-chart-4/20 text-chart-4",
  group: "bg-chart-5/20 text-chart-5",
};

const statusStyles = {
  active: "bg-success/10 text-success",
  disabled: "bg-muted text-muted-foreground",
  suspended: "bg-destructive/10 text-destructive",
};

export default function Mailboxes() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", display_name: "", type: "personal" });
  const queryClient = useQueryClient();

  const { data: mailboxes, isLoading } = useQuery({
    queryKey: ["mailboxes"],
    queryFn: () => base44.entities.Mailbox.list("-created_date"),
  });

  const createMailbox = useMutation({
    mutationFn: (data) => base44.entities.Mailbox.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
      setOpen(false);
      setForm({ email: "", display_name: "", type: "personal" });
    },
  });

  const handleCreate = () => {
    if (!form.email.trim() || !form.display_name.trim()) return;
    createMailbox.mutate({
      ...form,
      organization_id: "default",
      domain_id: "default",
      status: "active",
      storage_used_mb: 0,
      storage_limit_mb: 5120,
      unread_count: 0,
    });
  };

  const filtered = mailboxes?.filter(
    (m) =>
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.display_name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Mailboxes</h1>
          <p className="text-muted-foreground mt-1">Manage email accounts, aliases, and shared inboxes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Create Mailbox
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Mailbox</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  placeholder="John Doe"
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="shared">Shared Inbox</SelectItem>
                    <SelectItem value="alias">Alias</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} disabled={createMailbox.isPending} className="w-full">
                {createMailbox.isPending ? "Creating..." : "Create Mailbox"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search mailboxes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 rounded-2xl bg-muted mb-4">
            <Mail className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No mailboxes yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Create your first mailbox to get started.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Mailbox</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Storage</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Unread</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((mailbox) => {
                  const storagePercent = mailbox.storage_limit_mb
                    ? Math.round((mailbox.storage_used_mb / mailbox.storage_limit_mb) * 100)
                    : 0;
                  return (
                    <tr key={mailbox.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium">{mailbox.display_name}</p>
                          <p className="text-xs text-muted-foreground">{mailbox.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeStyles[mailbox.type] || ""}`}>
                          {mailbox.type}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[mailbox.status] || ""}`}>
                          {mailbox.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{mailbox.storage_used_mb || 0} MB</span>
                            <span className="text-muted-foreground">{storagePercent}%</span>
                          </div>
                          <Progress value={storagePercent} className="h-1.5" />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {mailbox.unread_count > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {mailbox.unread_count}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Mailbox</DropdownMenuItem>
                            <DropdownMenuItem>Set Forwarding</DropdownMenuItem>
                            <DropdownMenuItem>Auto Reply</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Disable</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
