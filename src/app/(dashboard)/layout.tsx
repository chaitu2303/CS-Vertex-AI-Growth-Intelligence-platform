import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-transparent">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4 justify-between sticky top-0 z-10 glass-panel">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div className="w-px h-4 bg-border mx-2" />
            <h1 className="text-sm font-medium">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6 pt-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
