"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp, Download } from "lucide-react"
import * as XLSX from "xlsx"

export default function CrmPage() {
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

  const newLeads = leads.filter(l => l.status === "NEW").length
  const contacted = leads.filter(l => l.status === "CONTACTED").length
  const proposalSent = leads.filter(l => l.status === "PROPOSAL_SENT").length

  const [filter, setFilter] = useState("HOT_QUEUE")

  let filteredLeads = leads.filter(lead => {
    switch (filter) {
      case "HOT_QUEUE": return lead.status !== "WON" && lead.status !== "LOST";
      case "NO_WEBSITE": return !lead.hasWebsite;
      case "LOW_SCORE": return lead.leadScore < 50;
      case "HIGH_RATING": return lead.rating > 4;
      case "HIGH_OPPORTUNITY": return lead.priority === "HIGH";
      default: return true;
    }
  })

  if (filter === "HOT_QUEUE") {
    filteredLeads.sort((a, b) => {
      const scoreA = (a.growthSignal || 0) + (a.conversionProbability || 0);
      const scoreB = (b.growthSignal || 0) + (b.conversionProbability || 0);
      return scoreB - scoreA;
    });
    filteredLeads = filteredLeads.slice(0, 10); // Top 10
  }

  const exportToExcel = () => {
    const dataToExport = filteredLeads.map(lead => ({
      BusinessName: lead.name,
      Address: lead.address,
      Website: lead.website || "No Website",
      Priority: lead.priority,
      Status: lead.status,
      LeadScore: lead.leadScore,
      GrowthSignal: lead.growthSignal || 0,
      ConversionProbability: lead.conversionProbability || 0,
    }))
    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Leads")
    XLSX.writeFile(wb, "crm_leads_export.xlsx")
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CRM Dashboard</h2>
          <p className="text-muted-foreground">Manage your analyzed leads and track outreach progress.</p>
        </div>
        <Button onClick={exportToExcel} className="hidden md:flex gap-2">
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : newLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : contacted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposal Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : proposalSent}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant={filter === "HOT_QUEUE" ? "default" : "outline"} size="sm" onClick={() => setFilter("HOT_QUEUE")} className={filter === "HOT_QUEUE" ? "bg-red-500 hover:bg-red-600 text-white" : "border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"}>🔥 Top 10 Hot Leads</Button>
        <Button variant={filter === "ALL" ? "default" : "outline"} size="sm" onClick={() => setFilter("ALL")}>All Leads</Button>
        <Button variant={filter === "NO_WEBSITE" ? "default" : "outline"} size="sm" onClick={() => setFilter("NO_WEBSITE")}>No Website</Button>
        <Button variant={filter === "LOW_SCORE" ? "default" : "outline"} size="sm" onClick={() => setFilter("LOW_SCORE")}>Website Score &lt; 50</Button>
        <Button variant={filter === "HIGH_RATING" ? "default" : "outline"} size="sm" onClick={() => setFilter("HIGH_RATING")}>Rating &gt; 4</Button>
        <Button variant={filter === "HIGH_OPPORTUNITY" ? "default" : "outline"} size="sm" onClick={() => setFilter("HIGH_OPPORTUNITY")}>High Opportunity</Button>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="p-0 flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Opportunity Score</TableHead>
                {filter === "HOT_QUEUE" ? <TableHead>Growth Signal</TableHead> : <TableHead>Conversion Prob.</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {!loading && filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No leads found. Go to the Discovery Engine to analyze and save leads.
                  </TableCell>
                </TableRow>
              )}
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{lead.name}</span>
                      <span className="text-xs text-muted-foreground">{lead.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={lead.priority === "HIGH" ? "destructive" : lead.priority === "MEDIUM" ? "secondary" : "outline"}
                      className={lead.priority === "MEDIUM" ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30" : ""}
                    >
                      {lead.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className={`font-bold ${lead.leadScore > 80 ? "text-green-500" : lead.leadScore > 50 ? "text-yellow-500" : "text-muted-foreground"}`}>
                      {lead.leadScore}/100
                    </div>
                  </TableCell>
                  {filter === "HOT_QUEUE" ? (
                    <TableCell>
                      <div className={`font-bold text-red-500 flex items-center gap-1`}>
                        <TrendingUp className="h-4 w-4" /> {lead.growthSignal || 0}/100
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <div className={`font-bold ${lead.conversionProbability > 70 ? "text-green-500" : lead.conversionProbability > 40 ? "text-yellow-500" : "text-destructive"}`}>
                        {lead.conversionProbability || 0}%
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <Link href={`/crm/${lead.id}`}>
                      <Button variant="secondary" size="sm">Details</Button>
                    </Link>
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
