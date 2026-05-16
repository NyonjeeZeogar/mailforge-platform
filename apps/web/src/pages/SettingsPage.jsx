import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  MoreVertical,
  Plus,
  Save,
  Settings,
} from "lucide-react";
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

const tabs = ["General", "Email", "DNS & Delivery", "Notifications"];

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const [activeOrgId, setActiveOrgId] = useState("");
  const [activeTab, setActiveTab] = useState("General");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

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

  useEffect(() => {
    if (!activeOrgId && organizations.length > 0) {
      setActiveOrgId(organizations[0].id);
    }
  }, [organizations, activeOrgId]);

  const activeOrganization = useMemo(() => {
    return organizations.find((org) => org.id === activeOrgId) || organizations[0] || null;
  }, [organizations, activeOrgId]);

  useEffect(() => {
    if (activeOrganization) {
      setName(activeOrganization.name || "");
      setSupportEmail(activeOrganization.supportEmail || "");
      setTimezone(activeOrganization.timezone || "");
      setSuccessMessage("");
    }
  }, [activeOrganization]);

  const createOrganization = useMutation({
    mutationFn: () =>
      api.post("/organizations", {
        name: newOrgName.trim(),
      }),
    onSuccess: (createdOrg) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["activity-events"] });

      setActiveOrgId(createdOrg.id);
      setNewOrgName("");
      setShowCreateForm(false);
      setSuccessMessage("Organization created successfully.");
    },
  });

  const updateOrganization = useMutation({
    mutationFn: () => {
      if (!activeOrganization?.id) {
        throw new Error("No organization selected");
      }

      return api.patch(`/organizations/${activeOrganization.id}`, {
        name: name.trim(),
        supportEmail: supportEmail.trim() || null,
        timezone: timezone || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["activity-events"] });

      setSuccessMessage("Settings saved successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const handleCreateOrganization = () => {
    if (!newOrgName.trim()) return;
    createOrganization.mutate();
  };

  const handleSave = () => {
    if (!name.trim()) return;
    updateOrganization.mutate();
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Platform configuration and preferences
          </p>
        </div>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowCreateForm((value) => !value)}
        >
          <Plus className="h-4 w-4" />
          New Organization
        </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error.message || "Failed to load organization settings"}
        </div>
      ) : null}

      {showCreateForm ? (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              value={newOrgName}
              onChange={(event) => setNewOrgName(event.target.value)}
              placeholder="Organization name"
            />
            <Button
              onClick={handleCreateOrganization}
              disabled={createOrganization.isPending || !newOrgName.trim()}
            >
              {createOrganization.isPending ? "Creating..." : "Create"}
            </Button>
          </div>

          {createOrganization.error ? (
            <p className="mt-3 text-sm text-red-600">
              {createOrganization.error.message || "Failed to create organization"}
            </p>
          ) : null}
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : !activeOrganization ? (
        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-muted-foreground">No organization found.</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Building2 className="h-4 w-4" />
              Active Organization
            </div>

            <div className="flex flex-wrap gap-2">
              {organizations.map((org, index) => {
                const isActive = org.id === activeOrganization.id;

                return (
                  <button
                    key={org.id}
                    onClick={() => setActiveOrgId(org.id)}
                    className={[
                      "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background hover:bg-muted",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-2 w-2 rounded-full",
                        isActive ? "bg-green-300" : "bg-green-500",
                      ].join(" ")}
                    />
                    {org.name}
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-[10px]",
                        isActive
                          ? "bg-white/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {index === 0 ? "business" : "starter"}
                    </span>
                    {isActive ? <Check className="h-3.5 w-3.5" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                  {activeOrganization.name?.charAt(0)?.toUpperCase() || "O"}
                </div>
                <div>
                  <h2 className="font-semibold">{activeOrganization.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    ID: {activeOrganization.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  active
                </span>
                <button className="rounded-md p-2 hover:bg-muted">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  "rounded-lg px-4 py-2 text-sm font-medium transition",
                  activeTab === tab
                    ? "bg-background shadow-sm border"
                    : "text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "General" ? (
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Organization Settings</h2>
              </div>

              <div className="border-t" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Owner / Billing Email</Label>
                  <Input
                    type="email"
                    value={supportEmail}
                    onChange={(event) => setSupportEmail(event.target.value)}
                    placeholder="admin@acme.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Plan</Label>
                  <select
                    value="Business"
                    disabled
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm opacity-80"
                  >
                    <option>Business</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    value="Active"
                    disabled
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm opacity-80"
                  >
                    <option>Active</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Timezone</Label>
                  <select
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value)}
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

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSave}
                  disabled={updateOrganization.isPending || !name.trim()}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateOrganization.isPending ? "Saving..." : "Save Changes"}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Changes apply to this organization only.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-8 shadow-sm text-center">
              <Settings className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
              <h2 className="font-semibold">{activeTab}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                This section is ready for the next settings pass.
              </p>
            </div>
          )}

          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h2 className="font-semibold">Usage Limits</h2>
            <div className="border-t" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <UsageCard label="Max Users" value="50" />
              <UsageCard label="Max Domains" value="5" />
              <UsageCard label="Storage" value="360 GB" />
              <UsageCard label="Used" value="18432 MB" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function UsageCard({ label, value }) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
