"use client"

import { Bookmark, Clock3 } from "lucide-react"
import type { SavedJob } from "@/lib/api/saved-jobs"

interface SavedJobsStatsProps {
  savedJobs: SavedJob[]
}

export function SavedJobsStats({ savedJobs }: SavedJobsStatsProps) {
  const now = new Date()

  const closingSoonCount = savedJobs.filter(({ job }) => {
    if (!job.deadline || job.status === "expired") return false

    const deadline = new Date(job.deadline)

    if (Number.isNaN(deadline.getTime())) return false

    const daysLeft =
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

    return daysLeft >= 0 && daysLeft <= 7
  }).length

  const stats = [
    {
      label: "Total Saved",
      value: savedJobs.length,
      description: "Jobs in your saved list",
      icon: Bookmark,
    },
    {
      label: "Closing Soon",
      value: closingSoonCount,
      description: "Deadline within 7 days",
      icon: Clock3,
    },
  ]

  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[340px] sm:gap-3">
      {stats.map(({ label, value, description, icon: Icon }) => (
        <div
          key={label}
          className="min-w-0 rounded-xl border border-white/10 bg-[#0d0d0e] px-3 py-3 sm:w-[165px] sm:px-3.5 sm:py-3"
        >
          <div className="flex items-center justify-between gap-1">
            <p className="truncate text-[11px] font-medium text-white/50 sm:text-xs">
              {label}
            </p>

            <Icon className="size-4 shrink-0 text-white/55" />
          </div>

          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-white/40 sm:text-[11px]">
            {description}
          </p>
        </div>
      ))}
    </div>
  )
}
