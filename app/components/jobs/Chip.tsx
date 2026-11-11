import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Small rounded chip with an optional icon (type, location, benefits...). */
export function Chip({
  icon: Icon,
  children,
  className,
}: {
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-1 rounded-full border border-[#2a2a2f] bg-[#1c1c1f] px-2.5 py-1.5 text-[11px] font-medium text-[#d4d4d8] sm:gap-1.5 sm:px-3 sm:text-xs",
        className
      )}
    >
      {Icon ? <Icon className="size-3 shrink-0 text-[#8a8a95]" /> : null}
      <span className="break-words">{children}</span>
    </span>
  )
}
