"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

export function ApplicationPagination() {
  return (
    <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-white/40">
        Showing <span className="font-medium text-white">0</span> of{" "}
        <span className="font-medium text-white">0</span> applications
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled
          className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/30 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#5b4fe9] px-3 text-sm font-medium text-white">
          1
        </span>

        <button
          type="button"
          disabled
          className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/30 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
