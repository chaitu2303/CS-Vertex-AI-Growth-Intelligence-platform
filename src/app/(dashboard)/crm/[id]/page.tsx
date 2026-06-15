"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Globe, Star, MapPin, Phone } from "lucide-react"

export default function LeadDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetch(`/api/leads/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.lead) {
          setLead(data.lead)
          setNotes(data.lead.notes || "")
          setStatus(data.lead.status)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/leads/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes })
      })
      alert("Lead updated successfully!")
    } catch (error) {
      console.error(error)
      alert("Failed to update lead")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  if (!lead) {
    return <div className="flex h-full items-center justify-center">Lead not found.</div>
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full h-full pb-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/crm")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{lead.name}</h2>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <Badge variant="outline">{lead.status}</Badge>
            <Badge variant={lead.priority === "HIGH" ? "destructive" : "secondary"}>{lead.priority} PRIORITY</Badge>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.address && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {lead.address}</div>}
              {lead.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {lead.phone}</div>}
              {lead.website && <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /> <a href={lead.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{lead.website}</a></div>}
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-muted-foreground" /> {lead.rating} ({lead.reviewCount} reviews)</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opportunity Analysis</CardTitle>
              <CardDescription>Opportunity Score: {lead.leadScore}/100</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lead.opportunityCategories && lead.opportunityCategories.length > 0 ? (
                  lead.opportunityCategories.map((cat: string) => (
                    <Badge key={cat} variant="secondary" className="bg-primary/10 text-primary">{cat}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No specific categories identified.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-blue-500/20 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-600 dark:text-blue-400">AI Acquisition Engine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Conversion Probability</span>
                <span className={`font-bold ${lead.conversionProbability > 70 ? "text-green-500" : lead.conversionProbability > 40 ? "text-yellow-500" : "text-destructive"}`}>
                  {lead.conversionProbability || 0}%
                </span>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push(`/crm/${lead.id}/proposal`)}>
                Generate AI Proposal
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push(`/crm/${lead.id}/outreach`)}>
                Generate Outreach Messages
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.activities && lead.activities.length > 0 ? (
                <div className="space-y-4">
                  {lead.activities.map((activity: any) => (
                    <div key={activity.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="mt-1">
                        {activity.type === "EMAIL" ? <Mail className="h-5 w-5 text-blue-500" /> : activity.type === "LINKEDIN" ? <Linkedin className="h-5 w-5 text-blue-700" /> : <MessageSquare className="h-5 w-5 text-green-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{activity.subject || `${activity.type} Sent`}</p>
                        <p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString()} • Status: <span className="text-blue-500 font-medium">{activity.status}</span></p>
                        <p className="text-sm mt-2 bg-muted/50 p-3 rounded-md border text-muted-foreground italic line-clamp-3">{activity.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No outreach activity recorded yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="INTERESTED">Interested</SelectItem>
                    <SelectItem value="PROPOSAL_SENT">Proposal Sent</SelectItem>
                    <SelectItem value="WON">Won (Client)</SelectItem>
                    <SelectItem value="LOST">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea 
                  placeholder="Add notes from calls, emails, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <Button className="w-full" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Updates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
