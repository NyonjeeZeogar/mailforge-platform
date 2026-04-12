import { useState } from "react";
import { Mail, Plus, Search, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Mailboxes() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [localPart, setLocalPart] = useState("");
  const [domainId, setDomainId] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const {
    data: mailboxes = [],
    isLoading: isLoadingMailboxes,
    error: mailboxesError,
  } = useQuery({
    queryKey: ["mailboxes"],
    queryFn: () => api.get("/mailboxes"),
  });

  const { data: domains = [], isLoading: isLoadingDomains } = useQuery({
    queryKey: ["domains"],
    queryFn: () => api.get("/domains"),
  });

  const createMailbox = useMutation({
    mutationFn: async () => {
      if (!localPart.trim()) throw new Error("Mailbox name is required");
      if (!domainId) throw new Error("Please select a domain");
      if (!password.trim()) throw new Error("Password is required");

      return api.post("/mailboxes", {
        localPart: localPart.trim(),
        domainId,
        password: password.trim(),
        displayName: displayName.trim() || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
      queryClient.invalidateQueries({ queryKey: ["activity-events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setOpen(false);
      setLocalPart("");
      setDomainId("");
      setPassword("");
      setDisplayName("");
    },
  });

  const deleteMailbox = useMutation({
    mutationFn: (id) => api.delete(`/mailboxes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
      queryClient.invalidateQueries({ queryKey: ["activity-events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const filteredMailboxes = mailboxes.filter((mailbox) =>
    mailbox.address?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    createMailbox.mutate();
  };

  const handleDelete = (id, address) => {
    const confirmed = window.confirm(
      `Delete mailbox "${address}"? This cannot be undone.`
    );

    if (!confirmed) return;

    deleteMailbox.mutate(id);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Mailboxes
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage mailbox accounts for your domains
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Mailbox
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Mailbox</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Mailbox Name</Label>
                <Input
                  placeholder="hello"
                  value={localPart}
                  onChange={(e) => setLocalPart(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  placeholder="Hello Team"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Domain</Label>
                <select
                  value={domainId}
                  onChange={(e) => setDomainId(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a domain</option>
                  {domains.map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      {domain.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter mailbox password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {createMailbox.error ? (
                <p className="text-sm text-red-500">
                  {createMailbox.error.message}
                </p>
              ) : null}

              <Button
                onClick={handleCreate}
                disabled={createMailbox.isPending || isLoadingDomains}
                className="w-full"
              >
                {createMailbox.isPending ? "Adding..." : "Add Mailbox"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search mailboxes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {mailboxesError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {mailboxesError.message || "Failed to load mailboxes"}
        </div>
      ) : null}

      {deleteMailbox.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {deleteMailbox.error.message || "Failed to delete mailbox"}
        </div>
      ) : null}

      {isLoadingMailboxes ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : filteredMailboxes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-2xl bg-muted p-4">
            <Mail className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No mailboxes yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add your first mailbox to start sending and receiving email on your
            domains.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMailboxes.map((mailbox) => (
            <div
              key={mailbox.id}
              className="rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{mailbox.address}</h3>
                  <p className="text-sm text-muted-foreground">
                    Domain: {mailbox.domain?.name || "Unknown domain"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(mailbox.createdAt).toLocaleString()}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(mailbox.id, mailbox.address)}
                  disabled={deleteMailbox.isPending}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleteMailbox.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
