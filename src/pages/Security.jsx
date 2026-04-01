import { Shield, Key, Smartphone, Monitor, Globe, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const sessions = [
  { device: "Chrome on macOS", ip: "192.168.1.1", location: "San Francisco, CA", lastActive: "Active now", current: true },
  { device: "Safari on iPhone", ip: "192.168.1.2", location: "San Francisco, CA", lastActive: "2 hours ago", current: false },
  { device: "Outlook on Windows", ip: "10.0.0.15", location: "New York, NY", lastActive: "1 day ago", current: false },
];

const securitySettings = [
  { id: "2fa", label: "Two-Factor Authentication", description: "Require 2FA for all users", enabled: true, icon: Smartphone },
  { id: "sso", label: "SSO / SAML", description: "Single sign-on for enterprise", enabled: false, icon: Key },
  { id: "app_passwords", label: "App Passwords", description: "Allow app-specific passwords for IMAP/SMTP", enabled: true, icon: Lock },
  { id: "ip_restrict", label: "IP Restrictions", description: "Restrict access by IP address range", enabled: false, icon: Globe },
];

export default function Security() {
  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground mt-1">Authentication, compliance, and access controls</p>
      </div>

      {/* Security Score */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-success/10">
            <Shield className="w-8 h-8 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Security Score: Strong</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Your platform is well-configured. Enable SSO and IP restrictions for maximum security.</p>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-8 h-2 rounded-full ${i <= 3 ? "bg-success" : "bg-muted"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        <div className="p-5">
          <h3 className="text-lg font-semibold">Security Policies</h3>
        </div>
        {securitySettings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between p-5 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-muted">
                <setting.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{setting.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
              </div>
            </div>
            <Switch defaultChecked={setting.enabled} />
          </div>
        ))}
      </div>

      {/* Active Sessions */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold">Active Sessions</h3>
          <Button variant="outline" size="sm" className="text-destructive">Revoke All</Button>
        </div>
        <div className="divide-y divide-border">
          {sessions.map((session, i) => (
            <div key={i} className="flex items-center justify-between p-5 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-muted">
                  <Monitor className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{session.device}</p>
                    {session.current && (
                      <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {session.ip} · {session.location} · {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compliance */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Compliance & Standards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "GDPR", status: "Compliant" },
            { name: "SOC 2", status: "In Progress" },
            { name: "HIPAA", status: "Not Started" },
            { name: "CAN-SPAM", status: "Compliant" },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              {item.status === "Compliant" ? (
                <CheckCircle className="w-4 h-4 text-success" />
              ) : item.status === "In Progress" ? (
                <AlertTriangle className="w-4 h-4 text-warning" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
