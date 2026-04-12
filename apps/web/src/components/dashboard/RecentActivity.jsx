import { Globe, Mail, Trash2, Users } from "lucide-react";
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
  const { data: activity = [] } = useQuery({
    queryKey: ["activity-events"],
    queryFn: async () => {
      const res = await fetch(`${API}/activity-events`);
      if (!res.ok) throw new Error("Failed to fetch activity events");
      return res.json();
    },
  });

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
            let Icon = Globe;

            if (item.type === "user_invited") Icon = Users;
            if (item.type === "user_deleted") Icon = Trash2;
            if (item.type === "mailbox_created") Icon = Mail;
            if (item.type === "mailbox_deleted") Icon = Trash2;
            if (item.type === "domain_created") Icon = Globe;
            if (item.type === "domain_deleted") Icon = Trash2;

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
