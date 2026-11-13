"use client"

import * as React from "react"
import { Filter, RotateCcw } from "lucide-react"

import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/jobs"
import { cn } from "@/lib/utils"

interface FilterSidebarProps {
  className?: string
  selectedJobType: string | null
  selectedCategory: string | null
  jobTypeCounts: Record<string, number>
  categoryCounts: Record<string, number>
  onSelectJobType: (type: string | null) => void
  onSelectCategory: (cat: string | null) => void
  onClearFilters: () => void
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return String(count)
}

export function FilterSidebar({
  className,
  selectedJobType,
  selectedCategory,
  jobTypeCounts,
  categoryCounts,
  onSelectJobType,
  onSelectCategory,
  onClearFilters,
}: FilterSidebarProps) {
  const hasActiveFilters = Boolean(selectedJobType) || Boolean(selectedCategory)

  const handleTypeClick = (type: string) => {
    // Single-select toggle: clicking again deselects
    onSelectJobType(selectedJobType === type ? null : type)
  }

  const handleCategoryClick = (cat: string) => {
    // Single-select toggle: clicking again deselects
    onSelectCategory(selectedCategory === cat ? null : cat)
  }

  return (
    <aside
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-white/10 bg-[#121214] p-5 shadow-sm",
        className
      )}
    >
      {/* Header matching Figma: Aside - Sidebar Filters > Heading 3: Filters */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-[#c3c0ff]" />
          <h3 className="text-base font-semibold text-white">Filters</h3>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs text-white/50 transition-colors hover:text-white"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Filter Group: Job Type (Single-Select) */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-semibold tracking-wide text-white/70 uppercase">
          Job Type
        </h4>
        <div className="flex flex-col gap-1.5">
          {JOB_TYPES.map((type) => {
            const isSelected = selectedJobType === type
            const count = jobTypeCounts[type] ?? 0
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeClick(type)}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors",
                  isSelected
                    ? "bg-[#5c53fe]/15 font-medium text-[#c3c0ff]"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border transition-all",
                      isSelected
                        ? "border-[#5c53fe] bg-[#5c53fe] text-white"
                        : "border-white/20 bg-transparent group-hover:border-white/40"
                    )}
                  >
                    {isSelected && (
                      <span className="size-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span>{type}</span>
                </div>
                <span
                  className={cn(
                    "text-[11px]",
                    isSelected ? "text-[#c3c0ff]" : "text-white/40"
                  )}
                >
                  {formatCount(count)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Filter Group: Category (Single-Select) */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-semibold tracking-wide text-white/70 uppercase">
          Category
        </h4>
        <div className="flex flex-col gap-1.5">
          {JOB_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat
            const count = categoryCounts[cat] ?? 0
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors",
                  isSelected
                    ? "bg-[#5c53fe]/15 font-medium text-[#c3c0ff]"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border transition-all",
                      isSelected
                        ? "border-[#5c53fe] bg-[#5c53fe] text-white"
                        : "border-white/20 bg-transparent group-hover:border-white/40"
                    )}
                  >
                    {isSelected && (
                      <span className="size-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="truncate">{cat}</span>
                </div>
                <span
                  className={cn(
                    "text-[11px]",
                    isSelected ? "text-[#c3c0ff]" : "text-white/40"
                  )}
                >
                  {formatCount(count)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
