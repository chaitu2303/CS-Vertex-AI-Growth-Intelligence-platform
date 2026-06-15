import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

export default function CompetitorsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Competitor Intelligence</h2>
        <p className="text-muted-foreground">Monitor and analyze your leads' top competitors.</p>
      </div>

      <Card className="flex-1 flex flex-col items-center justify-center text-center p-8 border-dashed">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <Building2 className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl mb-2">Competitor Dashboard</CardTitle>
        <CardDescription className="max-w-md text-base">
          This module is part of Phase 8. Currently, Competitor Intelligence is automatically generated and attached directly to your Lead Proposals! Check your CRM for active competitor insights.
        </CardDescription>
      </Card>
    </div>
  )
}
