import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { DashboardSidebar } from "../components/DashboardSidebar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <DashboardSidebar />
        <main className="min-w-0 flex-1 bg-background text-foreground">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  )
}

export default DashboardLayout
