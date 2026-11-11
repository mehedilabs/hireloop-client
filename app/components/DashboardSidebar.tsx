"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import logo from "@/app/images/logo.png"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import {
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  LayoutDashboard,
  PlusCircleIcon,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"

type Role = "seeker" | "recruiter" | "admin"

type MenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

const menuItemsByRole: Record<Role, MenuItem[]> = {
  seeker: [
    {
      id: "dashboard",
      name: "Dashboard",
      url: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    {
      id: "jobs",
      name: "Jobs",
      url: "/dashboard/seeker/jobs",
      icon: Briefcase,
    },
    {
      id: "saved-jobs",
      name: "Saved Jobs",
      url: "/dashboard/seeker/saved-jobs",
      icon: Bookmark,
    },
    {
      id: "applications",
      name: "Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    {
      id: "billing",
      name: "Billing",
      url: "/dashboard/seeker/billing",
      icon: Wallet,
    },
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/seeker/settings",
      icon: Settings,
    },
  ],
  recruiter: [
    {
      id: "dashboard",
      name: "Dashboard",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      id: "my-company",
      name: "My Company",
      url: "/dashboard/recruiter/my-company",
      icon: Building2,
    },
    {
      id: "manage-jobs",
      name: "Manage Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: Briefcase,
    },
    {
      id: "add-job",
      name: "Add job",
      url: "/dashboard/recruiter/jobs/new",
      icon: PlusCircleIcon,
    },
    {
      id: "applications",
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/recruiter/settings",
      icon: Settings,
    },
  ],
  admin: [
    {
      id: "dashboard",
      name: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    { id: "users", name: "Users", url: "/dashboard/admin/users", icon: Users },
    {
      id: "companies",
      name: "Companies",
      url: "/dashboard/admin/companies",
      icon: Building2,
    },
    { id: "jobs", name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
    {
      id: "payments",
      name: "Payments",
      url: "/dashboard/admin/payments",
      icon: Wallet,
    },
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ],
}

const ROLE_LABEL: Record<Role, string> = {
  seeker: "Job Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
}

const getRole = (role?: string): Role =>
  role === "recruiter" || role === "admin" ? role : "seeker"

export function DashboardSidebar() {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()
  const role = getRole(session?.user?.role)

  const name = session?.user?.name?.trim() ?? ""
  const initial = name.charAt(0).toUpperCase() || "U"

  return (
    <Sidebar className="border-white/10 [&_[data-sidebar=sidebar]]:bg-[#0c0c0d] [&_[data-sidebar=sidebar]]:text-white">
      {/* Header */}
      <SidebarHeader className="gap-3 border-b border-white/10 px-5 py-5">
        <Link href="/" aria-label="hireloop home" className="inline-block">
          <Image src={logo} alt="hireloop" priority className="h-7 w-auto" />
        </Link>

        {isPending ? (
          <span className="h-6 w-32 animate-pulse rounded-full bg-white/10" />
        ) : (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#5b4fe9]/30 bg-[#5b4fe9]/10 px-2.5 py-1 text-[11px] font-medium text-[#a79cf8]">
            <span className="size-1.5 rounded-full bg-[#7c6cf5]" />
            {ROLE_LABEL[role]} workspace
          </span>
        )}
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="px-3 py-4">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
            Application
          </SidebarGroupLabel>

          <SidebarMenu className="gap-1">
            {isPending
              ? Array.from({ length: 5 }).map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <div className="flex h-10 animate-pulse items-center gap-3 rounded-xl px-3">
                      <div className="size-[18px] rounded bg-white/10" />
                      <div className="h-3 w-24 rounded bg-white/10" />
                    </div>
                  </SidebarMenuItem>
                ))
              : menuItemsByRole[role].map((item) => {
                  const isActive =
                    item.id === "manage-jobs"
                      ? pathname === item.url ||
                        (pathname.startsWith(`${item.url}/`) &&
                          pathname !== `${item.url}/new`)
                      : item.id === "add-job"
                        ? pathname === item.url
                        : item.url === `/dashboard/${role}`
                          ? pathname === item.url
                          : pathname.startsWith(item.url)

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        render={<Link href={item.url} />}
                        className="relative h-10 gap-3 rounded-xl px-3 text-[14px] font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white data-[active=true]:bg-[#5b4fe9]/15 data-[active=true]:text-white data-[active=true]:before:absolute data-[active=true]:before:top-2 data-[active=true]:before:bottom-2 data-[active=true]:before:left-0 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-full data-[active=true]:before:bg-[#7c6cf5] [&>svg]:size-[18px] [&>svg]:text-white/40 hover:[&>svg]:text-white data-[active=true]:[&>svg]:text-[#8b7cf8]"
                      >
                        <item.icon />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: user card */}
      <SidebarFooter className="border-t border-white/10 p-3">
        {isPending ? (
          <div className="flex animate-pulse items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="size-10 rounded-full bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-2.5 w-32 rounded bg-white/10" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5b4fe9] to-[#8b7cf8] text-sm font-semibold text-white ring-2 ring-white/10">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {name || "User"}
              </p>
              <p className="truncate text-xs text-white/50">
                {session?.user?.email}
              </p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
