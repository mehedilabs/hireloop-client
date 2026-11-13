"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { JOB_CATEGORIES } from "@/lib/jobs"

interface SavedJobsFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  sortOption: string
  onSortChange: (value: string) => void
}

export function SavedJobsFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sortOption,
  onSortChange,
}: SavedJobsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#141415] p-4 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/35" />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search saved jobs..."
          aria-label="Search saved jobs"
          className="h-10 w-full rounded-xl border border-white/10 bg-[#0d0d0e] pr-3 pl-10 text-sm text-white transition outline-none placeholder:text-white/35 focus:border-white/30"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative">
          <SlidersHorizontal className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />

          <select
            value={categoryFilter}
            onChange={(event) => onCategoryChange(event.target.value)}
            aria-label="Filter by category"
            className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-[#0d0d0e] pr-8 pl-9 text-sm text-white outline-none focus:border-white/30 sm:w-44"
          >
            <option value="All">All Categories</option>
            {JOB_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <select
          value={sortOption}
          onChange={(event) => onSortChange(event.target.value)}
          aria-label="Sort saved jobs"
          className="h-10 w-full rounded-xl border border-white/10 bg-[#0d0d0e] px-3 text-sm text-white outline-none focus:border-white/30 sm:w-44"
        >
          <option value="Recently Saved">Recently Saved</option>
          <option value="Oldest Saved">Oldest Saved</option>
          <option value="Closing Soon">Closing Soon</option>
        </select>
      </div>
    </div>
  )
}
