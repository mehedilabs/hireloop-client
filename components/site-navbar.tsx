"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import Image from "next/image"
import logo from "@/app/images/logo.png"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
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

export default function SiteNavbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // স্ক্রিন desktop সাইজে গেলে mobile sheet বন্ধ করে দেয়
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 text-white sm:px-6">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-[#1e1e1f]/90 px-4 shadow-lg shadow-black/40 backdrop-blur-md sm:px-6"
      >
        <Logo />

        {/* Desktop */}
        <div className="hidden items-center md:flex">
          <ul className="flex items-center gap-8 text-[13px] font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-white/90 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <span className="mx-6 h-5 w-px bg-white/20" aria-hidden="true" />

          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "px-2 text-[14px] font-medium text-[#7c6cf5] hover:bg-transparent hover:text-[#968af8]"
            )}
          >
            Sign In
          </Link>

          <Link
            href="/get-started"
            className={cn(
              buttonVariants(),
              "ml-6 h-auto rounded-xl bg-[#5b4fe9] px-6 py-2.5 text-[14px] font-medium text-white hover:bg-[#6c61f0]"
            )}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "text-white/90 hover:bg-white/10 hover:text-white md:hidden"
            )}
          >
            <Menu className="h-6 w-6" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[280px] border-white/10 bg-[#1e1e1f] text-white sm:max-w-xs"
          >
            <SheetHeader className="text-left">
              <SheetTitle className="text-white">
                <Logo onClick={close} />
              </SheetTitle>
              <SheetDescription className="sr-only">
                Site navigation
              </SheetDescription>
            </SheetHeader>

            <ul className="mt-6 flex flex-col px-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="block rounded-lg px-2 py-3 text-[15px] font-medium text-white/90 hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 border-t border-white/10 px-4 pt-6">
              <Link
                href="/sign-in"
                onClick={close}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-auto rounded-xl border-white/15 bg-transparent py-2.5 text-[15px] font-medium text-[#7c6cf5] hover:bg-white/5 hover:text-[#968af8]"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/get-started"
                onClick={close}
                className={cn(
                  buttonVariants(),
                  "h-auto rounded-xl bg-[#5b4fe9] py-2.5 text-[15px] font-medium text-white hover:bg-[#6c61f0]"
                )}
              >
                Get Started
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
