"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  Briefcase,
  Building2,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Tag,
  type LucideIcon,
} from "lucide-react"

import logo from "@/app/images/logo.png"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { authClient, useSession } from "@/lib/auth-client"

type NavLink = { label: string; href: string; icon: LucideIcon }

const NAV_LINKS: NavLink[] = [
  { label: "Browse Jobs", href: "/browse-jobs", icon: Briefcase },
  { label: "Company", href: "/company", icon: Building2 },
  { label: "Pricing", href: "/pricing", icon: Tag },
]

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="hireloop home"
      className="flex items-center"
    >
      <Image src={logo} alt="hireloop" priority className="h-8 w-auto" />
    </Link>
  )
}

function Avatar({ letter, size }: { letter: string; size: "sm" | "lg" }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5b4fe9] to-[#8b7cf8] font-semibold text-white ring-2 ring-white/10",
        size === "sm" ? "size-8 text-[13px]" : "size-11 text-base"
      )}
    >
      {letter}
    </span>
  )
}

export default function SiteNavbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = useSession()

  const fullName = session?.user?.name?.trim() ?? ""
  const initial = fullName.charAt(0).toUpperCase() || "U"
  const firstName = (() => {
    const word = fullName.split(" ")[0] ?? ""
    return word.charAt(0).toUpperCase() + word.slice(1)
  })()

  const rawRole = session?.user?.role
  const role =
    rawRole === "recruiter" || rawRole === "admin" ? rawRole : "seeker"

  const links: NavLink[] = session?.user
    ? [
        ...NAV_LINKS,
        {
          label: "Dashboard",
          href: `/dashboard/${role}`,
          icon: LayoutDashboard,
        },
      ]
    : NAV_LINKS

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  // স্ক্রিন desktop সাইজে গেলে mobile sheet বন্ধ করে দেয়
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          close()
          router.refresh()
          router.push("/")
        },
      },
    })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 text-white sm:px-6">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-[#1e1e1f]/90 px-4 shadow-lg shadow-black/40 backdrop-blur-md sm:px-6"
      >
        <Logo />

        {/* Desktop */}
        <div className="hidden items-center md:flex">
          <ul className="flex items-center gap-1 text-[13px] font-medium">
            {links.map((link) => {
              const active = isActive(link.href)
              const isDashboard = link.label === "Dashboard"
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors",
                      isDashboard
                        ? active
                          ? "bg-[#5b4fe9]/25 text-white"
                          : "bg-[#5b4fe9]/10 text-[#a79cf8] hover:bg-[#5b4fe9]/20 hover:text-white"
                        : active
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {isDashboard && <link.icon className="size-3.5" />}
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <span className="mx-5 h-5 w-px bg-white/20" aria-hidden="true" />

          {isPending ? (
            <div className="flex animate-pulse items-center gap-3">
              <div className="size-8 rounded-full bg-white/10" />
              <div className="h-3 w-16 rounded bg-white/10" />
              <div className="ml-1 h-9 w-24 rounded-xl bg-white/10" />
            </div>
          ) : session?.user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar letter={initial} size="sm" />
                  <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-[#1e1e1f] bg-emerald-400" />
                </div>

                <span className="max-w-[110px] truncate text-[13px] font-semibold text-white">
                  {firstName}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/15 px-3.5 py-2 text-[13px] font-medium text-white/80 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300 focus-visible:ring-2 focus-visible:ring-[#7c6cf5] focus-visible:outline-none"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg px-3 py-2 text-[14px] font-medium text-[#7c6cf5] transition-colors hover:bg-white/5 hover:text-[#968af8]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="ml-4 rounded-xl bg-[#5b4fe9] px-6 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#6c61f0] focus-visible:ring-2 focus-visible:ring-[#7c6cf5] focus-visible:outline-none"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          >
            <Menu className="size-6" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-[300px] flex-col gap-0 border-white/10 bg-[#161617] p-0 text-white sm:max-w-xs"
          >
            <SheetHeader className="border-b border-white/10 px-6 py-5 text-left">
              <SheetTitle className="text-white">
                <Logo onClick={close} />
              </SheetTitle>
              <SheetDescription className="sr-only">
                Site navigation
              </SheetDescription>
            </SheetHeader>

            {/* Links */}
            <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
              {links.map((link) => {
                const active = isActive(link.href)
                const isDashboard = link.label === "Dashboard"
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors",
                        active
                          ? "bg-[#5b4fe9]/20 text-white"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                          active || isDashboard
                            ? "bg-[#5b4fe9]/30 text-[#a79cf8]"
                            : "bg-white/5 text-white/50"
                        )}
                      >
                        <link.icon className="size-[18px]" />
                      </span>
                      <span className="flex-1">{link.label}</span>
                      <ChevronRight
                        className={cn(
                          "size-4",
                          active ? "text-[#7c6cf5]" : "text-white/25"
                        )}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="space-y-3 border-t border-white/10 p-4">
              {isPending ? (
                <div className="animate-pulse space-y-3">
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="size-11 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 rounded bg-white/10" />
                      <div className="h-2.5 w-32 rounded bg-white/10" />
                    </div>
                  </div>
                  <div className="h-11 rounded-xl bg-white/10" />
                </div>
              ) : session?.user ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <Avatar letter={initial} size="lg" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {session.user.name}
                      </p>
                      <p className="truncate text-xs text-white/50">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 py-3 text-[15px] font-medium text-white/80 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300 active:bg-red-500/20"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={close}
                    className="block rounded-xl border border-white/15 py-3 text-center text-[15px] font-medium text-[#7c6cf5] transition-colors hover:bg-white/5 hover:text-[#968af8]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={close}
                    className="block rounded-xl bg-[#5b4fe9] py-3 text-center text-[15px] font-medium text-white transition-colors hover:bg-[#6c61f0]"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
