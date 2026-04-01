import { useState } from "react";
import { Save, Building2, Globe, Shield, Mail, Bell, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Platform configuration and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="dns">DNS & Delivery</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Organization Settings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input defaultValue="Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label>Primary Domain</Label>
                <Input defaultValue="acme.com" disabled />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input defaultValue="support@acme.com" />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select defaultValue="utc-8">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="utc+0">UTC</SelectItem>
                    <SelectItem value="utc+1">Central European (UTC+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="gap-2"><Save className="w-4 h-4" /> Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Email Configuration</h3>
            </div>
            <SettingRow label="Default mailbox storage limit" description="Storage allocated per new mailbox">
              <Select defaultValue="5120">
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024">1 GB</SelectItem>
                  <SelectItem value="5120">5 GB</SelectItem>
                  <SelectItem value="15360">15 GB</SelectItem>
                  <SelectItem value="30720">30 GB</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow label="Auto-purge trash" description="Automatically delete trash after 30 days">
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow label="Auto-purge spam" description="Automatically delete spam after 14 days">
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow label="Max attachment size" description="Maximum email attachment size in MB">
              <Select defaultValue="25">
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 MB</SelectItem>
                  <SelectItem value="25">25 MB</SelectItem>
                  <SelectItem value="50">50 MB</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </div>
        </TabsContent>

        <TabsContent value="dns" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">DNS & Delivery Settings</h3>
            </div>
            <SettingRow label="Outbound relay" description="SMTP relay for outbound mail delivery">
              <Select defaultValue="direct">
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct (Postfix)</SelectItem>
                  <SelectItem value="ses">Amazon SES</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow label="DKIM key rotation" description="Automatic DKIM key rotation interval">
              <Select defaultValue="90">
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow label="Cloudflare integration" description="Auto-configure DNS records via Cloudflare API">
              <Switch defaultChecked />
            </SettingRow>
            <div className="space-y-2">
              <Label>Cloudflare API Token</Label>
              <Input type="password" defaultValue="••••••••••••••••" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
            </div>
            <SettingRow label="Domain verification alerts" description="Get notified when domain DNS changes">
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow label="High bounce rate alerts" description="Alert when bounce rate exceeds threshold">
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow label="System health alerts" description="Notify when services go down">
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow label="New user registration" description="Notify when new users are added">
              <Switch />
            </SettingRow>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}
