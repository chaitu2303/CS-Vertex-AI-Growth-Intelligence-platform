"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const { isLoaded, isSignedIn, user } = useUser()

  return (
    <div className="flex flex-col gap-6 h-full max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Platform Settings</h2>
        <p className="text-muted-foreground">Manage your agency account and API configurations.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Agency Profile</CardTitle>
            <CardDescription>Your personal and agency information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                {isLoaded && isSignedIn ? user.firstName?.charAt(0) || user.emailAddresses[0].emailAddress.charAt(0).toUpperCase() : "?"}
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  {isLoaded && isSignedIn ? user.fullName || "Admin User" : "Loading..."}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {isLoaded && isSignedIn ? user.emailAddresses[0].emailAddress : ""}
                </p>
                <Badge className="mt-1" variant="secondary">Agency Owner</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys Card */}
        <Card>
          <CardHeader>
            <CardTitle>API Integrations</CardTitle>
            <CardDescription>Manage your third-party API keys (Configured via Vercel Environment Variables in Production).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="google-maps">Google Maps / Places API Key</Label>
              <Input id="google-maps" type="password" value="***********************************" readOnly className="bg-muted" />
              <p className="text-xs text-muted-foreground">Used for the Discovery Engine and interactive maps.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resend">Resend API Key</Label>
              <Input id="resend" type="password" value="***********************************" readOnly className="bg-muted" />
              <p className="text-xs text-muted-foreground">Used for automated CRM email outreach.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="neon">Neon Database URL</Label>
              <Input id="neon" type="password" value="***********************************" readOnly className="bg-muted" />
              <p className="text-xs text-muted-foreground">Primary PostgreSQL database connection.</p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription / Billing Card */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription & Billing</CardTitle>
            <CardDescription>Manage your platform usage and tier.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-primary">Enterprise Plan (Internal)</h4>
                  <p className="text-sm text-primary/80">Unlimited Leads & Full Features Unlocked</p>
                </div>
                <Badge variant="default" className="bg-primary text-primary-foreground hover:bg-primary">Active</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled>Manage Billing (Disabled for Internal Use)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
