"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface SavedJobsPaginationProps {
  currentPage: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function SavedJobsPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: SavedJobsPaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)

  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-white/45">
        Showing <span className="font-medium text-white/75">{startItem}</span>
        {" - "}
        <span className="font-medium text-white/75">{endItem}</span>
        {" of "}
        <span className="font-medium text-white/75">{totalItems}</span> saved
        jobs
      </p>

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft className="size-4" />
        </button>

        <span className="min-w-16 text-center text-xs text-white/60">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
