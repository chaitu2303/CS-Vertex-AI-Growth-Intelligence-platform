"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowLeft, Mail, MessageSquare, Send, Copy, CheckCircle2 } from "lucide-react"

export default function OutreachEnginePage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [activeTab, setActiveTab] = useState<"EMAIL" | "WHATSAPP" | "LINKEDIN">("EMAIL")
  const [generating, setGenerating] = useState(false)
  const [content, setContent] = useState("")
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const sendOutreach = async () => {
    if (!content) return;
    setSending(true)
    try {
      const res = await fetch(`/api/leads/${params.id}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          subject: activeTab === "EMAIL" ? `Digital Acquisition Strategy for ${lead.name}` : `Contact via ${activeTab}`,
          message: content
        })
      });
      if (res.ok) {
        setSent(true)
        setTimeout(() => setSent(false), 3000)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    fetch(`/api/leads/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.lead) setLead(data.lead)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [params.id])

  const generateMessage = (type: "EMAIL" | "WHATSAPP" | "LINKEDIN") => {
    setActiveTab(type)
    setGenerating(true)
    setCopied(false)
    setContent("")

    // Mocking an AI generation delay and dynamic response
    setTimeout(() => {
      let message = ""
      const hasWebsite = lead.hasWebsite
      const category = lead.category || "business"

      if (type === "EMAIL") {
        message = `Subject: Quick question about ${lead.name}'s online presence\n\nHi there,\n\nI was searching for a local ${category} today and came across ${lead.name}. You have great reviews (${lead.rating} stars!), but I noticed ${hasWebsite ? "your website isn't mobile-optimized and is missing key SEO tags" : "you don't have an official website set up yet"}.\n\nThis usually means you're losing 40-60% of potential customers to competitors who have a stronger digital footprint.\n\nI run CS Vertex, and we help local businesses plug these exact revenue leaks. I've put together a free, custom growth proposal detailing exactly how we can fix this and increase your inbound leads.\n\nAre you open to a quick 5-minute chat next Tuesday?\n\nBest,\n[Your Name]\nCS Vertex Lead Intelligence`
      } else if (type === "WHATSAPP") {
        message = `Hi team at ${lead.name}! 👋 I'm [Your Name] from CS Vertex. I saw your amazing ${lead.rating} star rating on Google, but noticed ${hasWebsite ? "your website isn't fully optimized for mobile devices" : "you don't have a website yet"}. You're likely losing inbound leads because of this! We help ${category}s fix this easily. Mind if I send over a quick, free proposal?`
      } else if (type === "LINKEDIN") {
        message = `Hi [Owner Name],\n\nI'm reaching out because I was impressed by ${lead.name}'s reputation, but noticed a few gaps in your digital presence (specifically ${hasWebsite ? "mobile responsiveness" : "lack of a website"}). \n\nI help ${category}s plug these revenue leaks and capture more leads. Let's connect! I have some insights to share.\n\nBest,\n[Your Name]`
      }

      setContent(message)
      setGenerating(false)
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  if (!lead) {
    return <div className="flex h-full items-center justify-center">Lead not found.</div>
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full h-full pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/crm/${lead.id}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Outreach Engine</h2>
          <p className="text-muted-foreground">Generate personalized sales copy for {lead.name}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Outreach Channels</CardTitle>
            <CardDescription>Select a channel to generate highly personalized AI copy based on the lead's digital flaws.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant={activeTab === "EMAIL" && content !== "" ? "default" : "outline"} 
              className="w-full justify-start" 
              onClick={() => generateMessage("EMAIL")}
              disabled={generating}
            >
              <Mail className="mr-2 h-4 w-4" /> Email Pitch
            </Button>
            <Button 
              variant={activeTab === "WHATSAPP" && content !== "" ? "default" : "outline"} 
              className="w-full justify-start" 
              onClick={() => generateMessage("WHATSAPP")}
              disabled={generating}
            >
              <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp Message
            </Button>
            <Button 
              variant={activeTab === "LINKEDIN" && content !== "" ? "default" : "outline"} 
              className="w-full justify-start" 
              onClick={() => generateMessage("LINKEDIN")}
              disabled={generating}
            >
              <Send className="mr-2 h-4 w-4" /> LinkedIn Connection
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Generated Response</CardTitle>
              <CardDescription>Review and edit the copy before sending.</CardDescription>
            </div>
            <div className="flex gap-2">
              {content && (
                <Button variant="secondary" size="sm" onClick={copyToClipboard}>
                  {copied ? <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
              {content && (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white" 
                  size="sm" 
                  onClick={sendOutreach}
                  disabled={sending || sent}
                >
                  {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : sent ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                  {sent ? "Sent!" : `Send ${activeTab === "EMAIL" ? "Email" : "Message"}`}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {generating ? (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                <p className="text-muted-foreground animate-pulse">CS Vertex AI is writing the perfect pitch...</p>
              </div>
            ) : content ? (
              <Textarea 
                className="flex-1 min-h-[300px] resize-none text-base p-4" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center min-h-[300px] border border-dashed rounded-lg">
                <p className="text-muted-foreground">Select an outreach channel on the left to begin.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
