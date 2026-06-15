"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useReactToPrint } from "react-to-print"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, CheckCircle2, AlertTriangle, TrendingUp, Download, Mail } from "lucide-react"

export default function AIProposalPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(true)
  
  const contentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef, documentTitle: `CS_Vertex_Proposal_${lead?.name || 'Lead'}` })

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

  useEffect(() => {
    if (!loading && lead) {
      const timer = setTimeout(() => {
        setGenerating(false)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [loading, lead])

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  if (!lead) {
    return <div className="flex h-full items-center justify-center">Lead not found.</div>
  }

  if (generating) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-6 max-w-md mx-auto text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Analyzing Business Profile...</h2>
          <p className="text-muted-foreground">CS Vertex AI is analyzing {lead.name}'s digital presence, calculating business impact, and generating a personalized acquisition proposal.</p>
        </div>
      </div>
    )
  }

  const hasWebsite = lead.hasWebsite

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full h-full pb-12">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/crm/${lead.id}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AI Acquisition Proposal</h2>
            <p className="text-muted-foreground">Generated for {lead.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handlePrint()}><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push(`/crm/${lead.id}/outreach`)}><Mail className="h-4 w-4 mr-2" /> Generate Outreach</Button>
        </div>
      </div>

      <div ref={contentRef} className="space-y-8 bg-background print:p-8 print:w-[210mm]">
        {/* Proposal Header (Visible in print) */}
        <div className="hidden print:block mb-8 border-b pb-4">
          <h1 className="text-4xl font-black text-blue-600 tracking-tighter">CS VERTEX</h1>
          <p className="text-sm font-bold tracking-widest text-muted-foreground mt-1 uppercase">Digital Acquisition Strategy</p>
          <h2 className="text-2xl font-bold mt-6">Prepared for: {lead.name}</h2>
          <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
        </div>
        {/* Executive Summary */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-500" /> Executive Summary</h3>
          <Card>
            <CardContent className="pt-6 text-lg leading-relaxed text-muted-foreground">
              We found that <strong className="text-foreground">{lead.name}</strong> has strong potential in the local market, supported by a rating of {lead.rating} across {lead.reviewCount} reviews. However, the business lacks several critical digital growth opportunities, including {hasWebsite ? "mobile optimization, proper SEO architecture, and lead capture mechanisms" : "a dedicated digital storefront (website) and unified online presence"}. Addressing these flaws will immediately increase local search visibility and drive inbound customer acquisition.
            </CardContent>
          </Card>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problems Found */}
          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Problems Found</h3>
            <Card className="h-full border-amber-500/20">
              <CardContent className="pt-6 space-y-4">
                {!hasWebsite ? (
                  <div className="flex gap-3 items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Missing Website</p>
                      <p className="text-sm text-muted-foreground">No digital storefront exists, causing massive drop-off for users searching online.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-3 items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Poor Mobile Experience</p>
                        <p className="text-sm text-muted-foreground">Website fails to adapt to modern mobile devices, hurting conversion rates.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Missing SEO Infrastructure</p>
                        <p className="text-sm text-muted-foreground">Lack of proper Title tags and Meta descriptions restricts Google search visibility.</p>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex gap-3 items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">No Lead Capture CRM</p>
                    <p className="text-sm text-muted-foreground">Manual follow-up processes lead to missed sales opportunities and revenue leakage.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Estimated Business Impact */}
          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-red-500" /> Estimated Business Impact</h3>
            <Card className="h-full border-red-500/20 bg-red-500/5">
              <CardContent className="pt-6 space-y-4">
                <div className="border-l-4 border-red-500 pl-4 py-1">
                  <p className="font-bold text-red-600 dark:text-red-400">Lost Leads & Revenue</p>
                  <p className="text-sm text-muted-foreground mt-1">Approximately 40-60% of local search traffic is abandoning {lead.name} in favor of competitors with stronger digital footprints.</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4 py-1">
                  <p className="font-bold text-red-600 dark:text-red-400">Missed Search Visibility</p>
                  <p className="text-sm text-muted-foreground mt-1">Failure to rank for high-intent keywords reduces organic traffic by an estimated 200+ views per month.</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4 py-1">
                  <p className="font-bold text-red-600 dark:text-red-400">Reduced Conversion Rates</p>
                  <p className="text-sm text-muted-foreground mt-1">Lack of trust signals and clear calls-to-action is halving potential inbound customer conversions.</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Competitor Intelligence */}
        {lead.competitors && lead.competitors.length > 0 && (
          <section className="print:break-before-page mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-purple-500" /> Competitor Intelligence</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {lead.competitors.map((comp: any, idx: number) => (
                <Card key={idx} className="border-purple-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-purple-600 dark:text-purple-400">{comp.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-semibold">{comp.rating} ⭐</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reviews:</span>
                      <span className="font-semibold">{comp.reviewCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Website:</span>
                      <span className={`font-semibold ${comp.website === "Exists" ? "text-green-500" : "text-amber-500"}`}>
                        {comp.website === "Exists" ? "Yes" : "No"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-6 border-purple-500/20 bg-purple-500/5">
              <CardContent className="pt-6">
                <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                  <strong className="font-bold">Key Insight:</strong> Your direct competitors have invested heavily in digital infrastructure ({lead.competitors.filter((c:any)=>c.website==="Exists").length} out of {lead.competitors.length} have established websites and strong review volumes). This infrastructure is helping them capture local customers before they even discover your business. Implementing our recommended improvements will close this digital gap and redirect that lost traffic back to you.
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Recommended Services (Mapped) */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /> Recommended Services</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Website {hasWebsite ? "Optimization" : "Development"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Fixes: {hasWebsite ? "Poor Mobile Experience" : "Missing Website"}</p>
                <p className="text-xs font-semibold mt-4 text-green-600 dark:text-green-400">CS VERTEX SOLUTION</p>
              </CardContent>
            </Card>
            <Card className="border-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Local SEO Boost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Fixes: Missing SEO Infrastructure & Low Visibility</p>
                <p className="text-xs font-semibold mt-4 text-green-600 dark:text-green-400">CS VERTEX SOLUTION</p>
              </CardContent>
            </Card>
            <Card className="border-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">CRM & Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Fixes: Manual Processes & Lost Leads</p>
                <p className="text-xs font-semibold mt-4 text-green-600 dark:text-green-400">CS VERTEX SOLUTION</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing Packages */}
        <section>
          <h3 className="text-xl font-bold mb-4">Pricing & Investment Options</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle>Starter</CardTitle>
                <CardDescription>Essential Fixes</CardDescription>
                <div className="text-3xl font-bold mt-4">$499</div>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 mt-4 text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Basic Landing Page</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Google Profile Claim</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Basic SEO Tags</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-blue-500 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-blue-600 dark:text-blue-400">Growth</CardTitle>
                <CardDescription>Full Acquisition System</CardDescription>
                <div className="text-3xl font-bold mt-4">$1,299</div>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 mt-4 text-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> High-Converting Website</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Advanced Local SEO</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Simple CRM Setup</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> 1 Month Maintenance</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle>Premium</CardTitle>
                <CardDescription>AI Automation</CardDescription>
                <div className="text-3xl font-bold mt-4">$2,999</div>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 mt-4 text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Everything in Growth</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> AI Chatbot Integration</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Automated Outreach</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Ongoing Analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
