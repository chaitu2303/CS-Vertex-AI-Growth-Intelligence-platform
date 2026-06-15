"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Globe, Star, Loader2 } from "lucide-react"

export default function DiscoveryPage() {
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("restaurants")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!location) return
    setLoading(true)
    try {
      const res = await fetch(`/api/places?location=${encodeURIComponent(location)}&category=${encodeURIComponent(category)}`)
      const data = await res.json()
      if (data.results) {
        setResults(data.results)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const [analyzingId, setAnalyzingId] = useState<string | null>(null)

  const handleAnalyze = async (business: any) => {
    setAnalyzingId(business.id)
    try {
      const res = await fetch("/api/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: business.hasWebsite ? business.websiteUri : null, name: business.name })
      })
      const data = await res.json()
      
      // Save lead to database
      const saveRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: business.id,
          name: business.name,
          address: business.address,
          website: business.hasWebsite ? business.websiteUri : null,
          hasWebsite: business.hasWebsite,
          rating: business.rating,
          reviewCount: business.reviewCount,
          leadScore: data.score,
          priority: data.priority,
          opportunityCategories: data.categories || [],
          conversionProbability: data.conversionProbability,
          growthSignal: data.growthSignal,
          competitors: data.competitors,
        })
      });
      
      if (!saveRes.ok) throw new Error("Failed to save lead");

      alert(`Lead Saved to CRM!\n\nScore: ${data.score}/100\nPriority: ${data.priority}\n\nIssues:\n- ${data.issues?.join("\n- ")}\n\nCategories:\n- ${data.categories?.join("\n- ")}`)
    } catch (error) {
      console.error(error)
      alert("Failed to analyze or save lead.")
    } finally {
      setAnalyzingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Discovery Engine</h2>
        <p className="text-muted-foreground">Find local businesses and identify website/SEO opportunities.</p>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">Location</label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-9" 
              placeholder="City, State, or Zip Code" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restaurants">Restaurants & Cafes</SelectItem>
              <SelectItem value="salons">Salons & Spas</SelectItem>
              <SelectItem value="clinics">Medical Clinics</SelectItem>
              <SelectItem value="retail">Retail Stores</SelectItem>
              <SelectItem value="contractors">Home Services & Contractors</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-32" onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Results Table */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col">
          <CardContent className="p-0 flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No results found. Search a location to find businesses.
                    </TableCell>
                  </TableRow>
                )}
                {results.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{business.name}</span>
                        <span className="text-xs text-muted-foreground">{business.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                        {business.rating} ({business.reviewCount})
                      </div>
                    </TableCell>
                    <TableCell>
                      {!business.hasWebsite ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-500">
                          No Website
                        </span>
                      ) : (
                        <a href={business.websiteUri} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                          Visit Site
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleAnalyze(business)} disabled={analyzingId === business.id}>
                        {analyzingId === business.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className="col-span-1 bg-muted/50 flex items-center justify-center border-dashed">
          <CardContent className="flex flex-col items-center justify-center text-center p-6">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium">Interactive Map</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Google Maps integration will render here to visualize local business clusters.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
