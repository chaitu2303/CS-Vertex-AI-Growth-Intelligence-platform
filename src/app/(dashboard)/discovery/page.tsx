import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Globe, Star } from "lucide-react"

export default function DiscoveryPage() {
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
            <Input className="pl-9" placeholder="City, State, or Zip Code" />
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">Category</label>
          <Select defaultValue="restaurants">
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
        <Button className="w-32">
          <Search className="mr-2 h-4 w-4" />
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
                {/* Mock Data */}
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>Joe's Pizza</span>
                      <span className="text-xs text-muted-foreground">123 Main St, NY</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                      4.5 (120)
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-500">
                      No Website
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Analyze</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>Bella Spa</span>
                      <span className="text-xs text-muted-foreground">456 Oak Ave, NY</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                      4.8 (85)
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-500/10 text-yellow-500">
                      Slow / Old
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Analyze</Button>
                  </TableCell>
                </TableRow>
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
