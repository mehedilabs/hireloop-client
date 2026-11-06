"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const TABS = [
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
]

export default function AuthToggle() {
  const pathname = usePathname()

  return (
    <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg py-2 text-center text-sm font-medium transition-colors",
              active
                ? "bg-[#5b4fe9] text-white"
                : "text-white/60 hover:text-white"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
