import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Platform Analytics</h2>
        <p className="text-muted-foreground">Track your agency's performance and conversion metrics.</p>
      </div>

      <Card className="flex-1 flex flex-col items-center justify-center text-center p-8 border-dashed">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <BarChart className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl mb-2">Analytics Engine Coming Soon</CardTitle>
        <CardDescription className="max-w-md text-base">
          Advanced tracking for Emails Sent, Open Rates, Reply Rates, and Pipeline Value is scheduled for the next major release. 
          For now, your basic pipeline numbers are available directly on your CRM Dashboard!
        </CardDescription>
      </Card>
    </div>
  )
}
