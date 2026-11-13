"use client"

import { Search, SlidersHorizontal } from "lucide-react"

export function ApplicationFilters() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
        <input
          type="search"
          placeholder="Search applications..."
          className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] pr-3 pl-10 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#7c6cf5]"
        />
      </div>

      <button
        type="button"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        <SlidersHorizontal className="size-4" />
        Filter by status
      </button>
    </div>
  )
}
