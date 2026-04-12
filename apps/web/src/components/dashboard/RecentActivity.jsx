import { Globe, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const API = import.meta.env.VITE_API_BASE_URL;

function getRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
}

export default function RecentActivity() {
  const { data: mailboxes = [] } = useQuery({
    queryKey: ["mailboxes"],
    queryFn: async () => {
      const res = await fetch(`${API}/mailboxes`);
      if (!res.ok) throw new Error("Failed to fetch mailboxes");
      return res.json();
    },
  });

  const { data: domains = [] } = useQuery({
    queryKey: ["domains"],
    queryFn: async () => {
      const res = await fetch(`${API}/domains`);
      if (!res.ok) throw new Error("Failed to fetch domains");
      return res.json();
    },
  });

  const mailboxActivity = mailboxes.map((mailbox) => ({
    id: `mailbox-${mailbox.id}`,
    type: "mailbox",
    message: `New mailbox ${mailbox.address} created`,
    createdAt: mailbox.createdAt,
  }));

  const domainActivity = domains.map((domain) => ({
    id: `domain-${domain.id}`,
    type: "domain",
    message: `Domain ${domain.name} added`,
    createdAt: domain.createdAt,
  }));

  const activity = [...mailboxActivity, ...domainActivity]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Recent Activity</h2>
        <p className="text-muted-foreground mt-1">Latest platform events</p>
      </div>

      {activity.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent activity yet.</p>
      ) : (
        <div className="space-y-6">
          {activity.map((item) => {
            const Icon = item.type === "mailbox" ? Mail : Globe;

            return (
              <div key={item.id} className="flex items-start gap-4">
                <div className="rounded-2xl bg-muted p-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="font-medium">{item.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {getRelativeTime(item.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
