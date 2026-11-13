"use client"

import { Search, SlidersHorizontal } from "lucide-react"

import type { ApplicationStatus } from "@/lib/types/applications"

interface ApplicationFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: ApplicationStatus | "All"
  onStatusChange: (value: ApplicationStatus | "All") => void
}

export function ApplicationFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: ApplicationFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search applications..."
          aria-label="Search applications"
          className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] pr-3 pl-10 text-sm text-white transition-colors outline-none placeholder:text-white/40 focus:border-[#7c6cf5] focus:bg-white/[0.05]"
        />
      </div>

      <div className="relative w-full sm:w-auto">
        <SlidersHorizontal className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-white/60" />

        <select
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value as ApplicationStatus | "All")
          }
          aria-label="Filter applications by status"
          className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-[#171719] py-2 pr-4 pl-10 text-sm text-white/70 transition-colors outline-none focus:border-[#7c6cf5] sm:min-w-40"
        >
          <option value="All">All statuses</option>
          <option value="Applied">Applied</option>
          <option value="Review">Review</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
          <option value="Offered">Offered</option>
        </select>
      </div>
    </div>
  )
}
