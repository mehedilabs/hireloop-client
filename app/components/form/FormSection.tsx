"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/** Card with an icon header, used to group job-form fields. */
export function FormSection({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-white/[0.07] bg-[#141418]">
      <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
        <span className="flex size-7 items-center justify-center rounded-lg bg-[#5b4fe9]/15 text-[#a79cf8] ring-1 ring-[#5b4fe9]/25">
          <Icon className="size-3.5" />
        </span>
        <h3 className="text-[14px] font-semibold tracking-tight text-[#ededef]">
          {title}
        </h3>
      </div>

      <div className="grid gap-3.5 p-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

/** Label + control + optional hint row; `full` spans both grid columns. */
export function FormField({
  label,
  htmlFor,
  full = false,
  required = false,
  hint,
  children,
}: {
  label: string
  htmlFor?: string
  full?: boolean
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("space-y-1.5", full && "sm:col-span-2")}>
      <Label
        htmlFor={htmlFor}
        className="text-[12px] font-medium text-[#c8c8d0]"
      >
        {label}
        {required ? <span className="ml-0.5 text-[#f87171]">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-[11px] text-[#6e6e78]">{hint}</p> : null}
    </div>
  )
}
