import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Platform Settings</h2>
        <p className="text-muted-foreground">Manage your account, team members, and API configurations.</p>
      </div>

      <Card className="flex-1 flex flex-col items-center justify-center text-center p-8 border-dashed">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <Settings className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl mb-2">Global Settings Coming Soon</CardTitle>
        <CardDescription className="max-w-md text-base">
          Multi-tenant Agency Accounts, Team Roles, and Custom White-Labeling will be available in the upcoming Multi-Tenant SaaS update (Phase 10).
          To manage your authentication settings, click your profile icon in the bottom left!
        </CardDescription>
      </Card>
    </div>
  )
}
