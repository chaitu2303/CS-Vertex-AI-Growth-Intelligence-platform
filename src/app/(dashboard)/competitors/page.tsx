"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, TrendingUp, Users } from "lucide-react"

export default function CompetitorsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/leads")
      .then(res => res.json())
      .then(data => {
        if (data.leads) setLeads(data.leads)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // Flatten competitors and pair them with their parent lead
  const competitorEntries = leads.flatMap(lead => 
    (lead.competitors || []).map((comp: any) => ({
      leadName: lead.name,
      leadRating: lead.rating,
      competitorName: comp.name,
      competitorRating: comp.rating,
      competitorReviews: comp.reviewCount,
      competitorWebsite: comp.website,
    }))
  )

  const totalCompetitorsTracked = competitorEntries.length;
  const averageCompetitorRating = totalCompetitorsTracked > 0 
    ? (competitorEntries.reduce((acc, curr) => acc + (curr.competitorRating || 0), 0) / totalCompetitorsTracked).toFixed(1)
    : 0;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Competitor Intelligence</h2>
        <p className="text-muted-foreground">Track local competition and identify market gaps for your leads.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competitors Tracked</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : totalCompetitorsTracked}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Competitor Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : averageCompetitorRating}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>A comparative analysis of your leads against their top local competitors.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Your Lead</TableHead>
                <TableHead>Lead Rating</TableHead>
                <TableHead>Competitor Name</TableHead>
                <TableHead>Competitor Rating</TableHead>
                <TableHead>Competitor Reviews</TableHead>
                <TableHead>Website</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {!loading && competitorEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No competitors tracked yet. Analyze more leads in the Discovery Engine.
                  </TableCell>
                </TableRow>
              )}
              {competitorEntries.map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{entry.leadName}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${entry.leadRating > (entry.competitorRating || 0) ? "text-green-500" : "text-red-500"}`}>
                      {entry.leadRating || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>{entry.competitorName}</TableCell>
                  <TableCell>{entry.competitorRating || "N/A"}</TableCell>
                  <TableCell>{entry.competitorReviews || 0}</TableCell>
                  <TableCell>
                    {entry.competitorWebsite === "None" ? (
                      <span className="text-red-500 text-xs">No Website</span>
                    ) : (
                      <span className="text-green-500 text-xs">Has Website</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
