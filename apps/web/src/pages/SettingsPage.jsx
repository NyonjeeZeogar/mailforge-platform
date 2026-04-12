import { useEffect, useState } from "react";
import { Building2, Save } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TIMEZONE_OPTIONS = [
  "Pacific Time (UTC-8)",
  "Mountain Time (UTC-7)",
  "Central Time (UTC-6)",
  "Eastern Time (UTC-5)",
  "UTC",
  "London (UTC+0)",
  "Central Europe (UTC+1)",
  "Eastern Europe (UTC+2)",
  "India Standard Time (UTC+5:30)",
  "China Standard Time (UTC+8)",
  "Japan Standard Time (UTC+9)",
  "Australian Eastern Time (UTC+10)",
];

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    data: organizations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => api.get("/organizations"),
  });

  const organization = organizations[0] || null;

  useEffect(() => {
    if (organization) {
      setName(organization.name || "");
      setSupportEmail(organization.supportEmail || "");
      setTimezone(organization.timezone || "");
    }
  }, [organization]);

  const updateOrganization = useMutation({
    mutationFn: async () => {
      if (!organization?.id) {
        throw new Error("No organization found");
      }

      return api.patch(`/organizations/${organization.id}`, {
        name: name.trim(),
        supportEmail: supportEmail.trim() || null,
        timezone: timezone || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["activity-events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setSuccessMessage("Settings saved successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    },
  });

  const handleSave = () => {
    setSuccessMessage("");
    if (!name.trim()) return;
    updateOrganization.mutate();
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform configuration and preferences
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error.message || "Failed to load organization settings"}
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : !organization ? (
        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-muted-foreground">No organization found.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-muted p-3">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Organization Settings</h2>
              <p className="text-sm text-muted-foreground">
                Manage your organization profile and defaults
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Inc"
              />
            </div>

            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@acme.com"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Timezone</Label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a timezone</option>
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {updateOrganization.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {updateOrganization.error.message || "Failed to save settings"}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={updateOrganization.isPending}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {updateOrganization.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
