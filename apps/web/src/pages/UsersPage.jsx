import { useMemo, useState } from "react";
import { Plus, Search, Trash2, Users } from "lucide-react";
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

export default function UsersPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("member");
  const [organizationId, setOrganizationId] = useState("");

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users"),
  });

  const { data: organizations = [], isLoading: isLoadingOrganizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => api.get("/organizations"),
  });

  const inviteUser = useMutation({
    mutationFn: async () => {
      if (!email.trim()) throw new Error("Email is required");
      if (!organizationId) throw new Error("Please select an organization");

      return api.post("/users/invite", {
        email: email.trim(),
        name: name.trim() || undefined,
        role,
        organizationId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setOpen(false);
      setEmail("");
      setName("");
      setRole("member");
      setOrganizationId("");
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();

    return users.filter((user) => {
      const emailMatch = user.email?.toLowerCase().includes(term);
      const nameMatch = user.name?.toLowerCase().includes(term);
      const orgMatch = user.organization?.name?.toLowerCase().includes(term);

      return emailMatch || nameMatch || orgMatch;
    });
  }, [users, search]);

  const handleInvite = () => {
    inviteUser.mutate();
  };

  const handleDelete = (id, label) => {
    const confirmed = window.confirm(
      `Delete user "${label}"? This cannot be undone.`
    );

    if (!confirmed) return;

    deleteUser.mutate(id);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Users
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage platform users and permissions.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Invite User
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite User</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Organization</Label>
                <select
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select an organization</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              {inviteUser.error ? (
                <p className="text-sm text-red-500">
                  {inviteUser.error.message}
                </p>
              ) : null}

              <Button
                onClick={handleInvite}
                disabled={inviteUser.isPending || isLoadingOrganizations}
                className="w-full"
              >
                {inviteUser.isPending ? "Inviting..." : "Send Invite"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {usersError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {usersError.message || "Failed to load users"}
        </div>
      ) : null}

      {deleteUser.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {deleteUser.error.message || "Failed to delete user"}
        </div>
      ) : null}

      {isLoadingUsers ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border bg-card">
          <div className="mb-4 rounded-2xl bg-muted p-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No users yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Invite your first user to start managing access to MailForge.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">
                    {user.name || "Unnamed User"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Role: {user.role || "member"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Organization: {user.organization?.name || "Unknown organization"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDelete(user.id, user.name || user.email)
                  }
                  disabled={deleteUser.isPending}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleteUser.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
