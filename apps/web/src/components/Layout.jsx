import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard, Globe, Users, Mail, CreditCard, Settings,
  Shield, Activity, ChevronLeft, ChevronRight, Search, Bell,
  Menu, Zap
} from "lucide-react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/domains", icon: Globe, label: "Domains" },
  { path: "/mailboxes", icon: Mail, label: "Mailboxes" },
  { path: "/users", icon: Users, label: "Users" },
  { path: "/webmail", icon: Mail, label: "Webmail" },
  { path: "/billing", icon: CreditCard, label: "Billing" },
  { path: "/security", icon: Shield, label: "Security" },
  { path: "/system", icon: Activity, label: "System" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function Layout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <div className="p-6">Loading...</div>;
  }

  const displayName = user?.name || "Admin";
  const displayEmail = user?.email || "admin@esp.io";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col bg-sidebar border-r border-sidebar-border
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-primary-foreground tracking-tight">
              ESP Provider
            </span>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center justify-center p-3 border-t border-sidebar-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search everything..."
                className="w-80 pl-10 pr-4 py-2 text-sm bg-muted rounded-lg border-0 focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {displayName.charAt(0)}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{displayEmail}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
