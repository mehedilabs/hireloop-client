"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface ApplicationPaginationProps {
  currentPage: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function ApplicationPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: ApplicationPaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1

  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-white/40">
        Showing <span className="font-medium text-white">{startItem}</span>-
        <span className="font-medium text-white">{endItem}</span> of{" "}
        <span className="font-medium text-white">{totalItems}</span>{" "}
        applications
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage === 1 || totalPages === 0}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/30 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#5b4fe9] px-3 text-sm font-medium text-white">
          {currentPage}
        </span>

        <button
          type="button"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-white/30 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
