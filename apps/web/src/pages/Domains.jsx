import { useState } from "react";
import { Plus, Search, Globe, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DomainCard from "../components/domains/DomainCard";
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

export default function Domains() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const queryClient = useQueryClient();

  const {
    data: domains = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["domains"],
    queryFn: async () => {
      const data = await api.get("/domains");

      return data.map((d) => ({
        ...d,
        domain_name: d.name,
      }));
    },
  });

  const createDomain = useMutation({
    mutationFn: async (domainName) => {
      const orgs = await api.get("/organizations");

      if (!Array.isArray(orgs) || orgs.length === 0) {
        throw new Error("No organization found");
      }

      return api.post("/domains", {
        name: domainName,
        organizationId: orgs[0].id,
        isCatchAllEnabled: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      setOpen(false);
      setNewDomain("");
    },
  });

  const deleteDomain = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/domains/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });

  const handleCreate = () => {
    if (!newDomain.trim()) return;
    createDomain.mutate(newDomain.trim());
  };

  const handleDelete = (id, name) => {
    const confirmed = window.confirm(
      `Delete domain "${name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    deleteDomain.mutate(id);
  };

  const filtered = domains.filter((d) =>
    d.domain_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Domains
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your email domains and DNS records
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Domain
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Domain</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Domain Name</Label>
                <Input
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                After adding, you'll need to configure DNS records to verify
                your domain.
              </p>

              {createDomain.error ? (
                <p className="text-sm text-red-500">
                  {createDomain.error.message}
                </p>
              ) : null}

              <Button
                onClick={handleCreate}
                disabled={createDomain.isPending}
                className="w-full"
              >
                {createDomain.isPending ? "Adding..." : "Add Domain"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search domains..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error.message || "Failed to load domains"}
        </div>
      ) : null}

      {deleteDomain.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {deleteDomain.error.message || "Failed to delete domain"}
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 rounded-2xl bg-muted mb-4">
            <Globe className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No domains yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Add your first domain to start setting up custom email addresses for
            your organization.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((domain) => (
            <div key={domain.id} className="space-y-3">
              <DomainCard domain={domain} />

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(domain.id, domain.domain_name)}
                  disabled={deleteDomain.isPending}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteDomain.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
