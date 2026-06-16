"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart as BarIcon, Target, Users, Zap, TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsPage() {
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

  // Calculate Metrics
  const totalLeads = leads.length;
  const missingWebsite = leads.filter(l => !l.hasWebsite).length;
  const contactedLeads = leads.filter(l => l.status === "CONTACTED").length;
  const wonLeads = leads.filter(l => l.status === "WON").length;
  
  // Pipeline Value (Assuming each Lead is worth roughly $1000 for standard web setup)
  const averageDealValue = 1000;
  const pipelineValue = totalLeads * averageDealValue;
  const closedWonValue = wonLeads * averageDealValue;

  // Chart Data: Leads by Priority
  const priorityData = [
    { name: 'High', value: leads.filter(l => l.priority === 'HIGH').length },
    { name: 'Medium', value: leads.filter(l => l.priority === 'MEDIUM').length },
    { name: 'Low', value: leads.filter(l => l.priority === 'LOW').length },
  ]

  // Chart Data: Status Distribution
  const statusData = [
    { name: 'New', count: leads.filter(l => l.status === 'NEW').length },
    { name: 'Contacted', count: contactedLeads },
    { name: 'Proposal Sent', count: leads.filter(l => l.status === 'PROPOSAL_SENT').length },
    { name: 'Won', count: wonLeads },
    { name: 'Lost', count: leads.filter(l => l.status === 'LOST').length },
  ]

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Platform Analytics</h2>
        <p className="text-muted-foreground">Track your agency's performance and conversion metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads Sourced</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : totalLeads}</div>
            <p className="text-xs text-muted-foreground">Analyzed via Discovery Engine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Websites</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : missingWebsite}</div>
            <p className="text-xs text-muted-foreground">High priority targets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${loading ? "..." : pipelineValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Est. $1k per setup</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Won Revenue</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">${loading ? "..." : closedWonValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Realized value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Lead Pipeline Status</CardTitle>
            <CardDescription>Funnel view of your current leads</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Lead Priority Distribution</CardTitle>
            <CardDescription>AI-Assigned priority scores</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
