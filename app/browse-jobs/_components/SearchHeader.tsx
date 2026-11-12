"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"

interface SearchHeaderProps {
  value: string
  onChange: (val: string) => void
  onSearch: (val: string) => void
}

export function SearchHeader({ value, onChange, onSearch }: SearchHeaderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#121214] p-4 sm:p-6 lg:p-8 shadow-sm">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Browse Jobs
        </h1>
        <p className="mt-2 text-xs text-white/50 sm:text-sm">
          Discover your next career opportunity from thousands of vetted openings
        </p>

        {/* Search input bar matching Figma Section - Search & Quick Filters */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-2 rounded-xl border border-white/10 bg-[#18181b] p-2 sm:flex-row sm:items-center sm:gap-3"
        >
          <div className="flex flex-1 items-center gap-3 px-3 py-1.5">
            <Search className="size-5 shrink-0 text-white/40" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Search by job title, keywords..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            className="h-10 shrink-0 gap-2 rounded-lg bg-[#5c53fe] px-5 text-sm font-semibold text-white shadow-lg shadow-[#5c53fe]/20 transition-all hover:bg-[#6c61f0]"
          >
            <Search className="size-4" />
            <span>Search Jobs</span>
          </Button>
        </form>
      </div>
    </section>
  )
}
