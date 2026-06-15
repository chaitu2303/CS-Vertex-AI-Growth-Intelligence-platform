import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BarChart, Building2, Globe, LayoutDashboard, Settings, Users } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Discovery Engine",
    url: "/discovery",
    icon: Globe,
  },
  {
    title: "CRM",
    url: "/crm",
    icon: Users,
  },
  {
    title: "Competitors",
    url: "/competitors",
    icon: Building2,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-bold">CS</span>
          </div>
          <span className="font-bold text-lg">Vertex Lead</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<a href={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 flex items-center justify-between">
          <div className="rounded-lg bg-sidebar-accent px-3 py-1.5 text-sidebar-accent-foreground text-xs font-medium">
            Admin Access
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
