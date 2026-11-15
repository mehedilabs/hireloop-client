"use client"

import type {
  ApplicationStatus,
  JobApplication,
} from "@/lib/types/applications"

export const STATUS_OPTIONS: ApplicationStatus[] = [
  "Applied",
  "Review",
  "Shortlisted",
  "Interview",
  "Offered",
  "Rejected",
]

export const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Review: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Shortlisted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Interview: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Offered: "bg-green-500/10 text-green-400 border-green-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
}

export const statusDots: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-400",
  Review: "bg-yellow-400",
  Shortlisted: "bg-purple-400",
  Interview: "bg-cyan-400",
  Offered: "bg-green-400",
  Rejected: "bg-red-400",
}

type ApplicationStatusSummaryProps = {
  applications: JobApplication[]
  selectedStatus?: ApplicationStatus | "All"
  onStatusChange?: (status: ApplicationStatus) => void
}

export default function ApplicationStatusSummary({
  applications,
  selectedStatus = "All",
  onStatusChange,
}: ApplicationStatusSummaryProps) {
  const statusCounts = STATUS_OPTIONS.map((status) => ({
    status,
    count: applications.filter((application) => application.status === status)
      .length,
  }))

  const clickable = Boolean(onStatusChange)

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-2.5">
      {statusCounts.map(({ status, count }) => {
        const isSelected = selectedStatus === status

        return (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange?.(status)}
            disabled={!onStatusChange}
            aria-pressed={isSelected}
            className={`relative flex min-w-0 flex-col gap-1.5 overflow-hidden rounded-lg border px-2.5 py-2 text-left transition-all duration-200 sm:px-3 sm:py-2.5 ${
              isSelected
                ? `${statusStyles[status]} ring-1 ring-current`
                : count > 0
                  ? statusStyles[status]
                  : "border-white/[0.05] bg-[#131316] text-[#6b6b76]"
            } ${
              clickable
                ? "cursor-pointer hover:-translate-y-0.5 hover:brightness-125 active:scale-[0.98]"
                : "cursor-default"
            }`}
          >
            <div className="flex min-w-0 items-center gap-1.5">
              <span
                className={`size-1.5 shrink-0 rounded-full ${
                  count > 0 ? statusDots[status] : "bg-white/15"
                }`}
              />

              <span className="truncate text-[9px] font-medium sm:text-[10px]">
                {status}
              </span>
            </div>

            <p
              className={`text-lg leading-none font-bold sm:text-xl ${
                count > 0 ? "text-white" : "text-[#4a4a54]"
              }`}
            >
              {count}
            </p>
          </button>
        )
      })}
    </div>
  )
}
