"use client"

import * as React from "react"
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface JobListHeaderProps {
  totalCount: number
  selectedSort: string
  onSortChange: (sortOption: string) => void
  onToggleMobileFilter: () => void
}

const SORT_OPTIONS = [
  "Most Recent",
  "Highest Salary",
  "Most Relevant",
  "Oldest",
]

export function JobListHeader({
  totalCount,
  selectedSort,
  onSortChange,
  onToggleMobileFilter,
}: JobListHeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelect = (option: string) => {
    onSortChange(option)
    setIsOpen(false)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
      {/* Figma: Section - Main Job Listing > Heading 2 */}
      <div>
        <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
          Found {totalCount.toLocaleString()} Professional Jobs
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile toggle button for filters */}
        <Button
          type="button"
          variant="outline"
          onClick={onToggleMobileFilter}
          className="h-8 gap-2 border-white/10 bg-[#161618] text-xs text-white/80 hover:bg-white/10 lg:hidden"
        >
          <SlidersHorizontal className="size-3.5" />
          <span>Filters</span>
        </Button>

        {/* Figma: Sort by: Most Recent dropdown */}
        <div className="relative flex items-center gap-2">
          <span className="hidden text-xs text-white/50 sm:inline">Sort by:</span>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-[#161618] px-3 text-xs font-medium text-white transition-colors hover:border-white/20 hover:bg-[#1a1a1d]"
          >
            <span>{selectedSort}</span>
            <ChevronDown className="size-3.5 text-white/50" />
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute right-0 top-10 z-40 w-44 rounded-xl border border-white/10 bg-[#1a1a1d] p-1.5 shadow-xl">
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = selectedSort === opt
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                        isSelected
                          ? "bg-[#5c53fe]/15 font-medium text-[#c3c0ff]"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="size-3 text-[#c3c0ff]" />}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
