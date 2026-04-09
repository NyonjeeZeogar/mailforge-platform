import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage platform users and permissions.
          </p>
        </div>

        <Button disabled className="gap-2">
          <Plus className="w-4 h-4" />
          Invite User
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">User management not connected yet</h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              This page no longer depends on Base44. Add Nest user endpoints before reconnecting list
              and invite actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
