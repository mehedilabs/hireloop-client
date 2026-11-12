"use client"

import * as React from "react"
import { Briefcase, RotateCcw } from "lucide-react"

import { JOB_CATEGORIES, JOB_TYPES, type JobPost } from "@/lib/jobs"
import { SearchHeader } from "./SearchHeader"
import { FilterSidebar } from "./FilterSidebar"
import { JobListHeader } from "./JobListHeader"
import { JobCard } from "./JobCard"

interface BrowseJobsLayoutProps {
  initialJobs: JobPost[]
}

export function BrowseJobsLayout({ initialJobs }: BrowseJobsLayoutProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedJobType, setSelectedJobType] = React.useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [sortOption, setSortOption] = React.useState("Most Recent")
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false)

  // Dynamically calculate actual job counts from the backend data for each Job Type
  const jobTypeCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    for (const type of JOB_TYPES) {
      counts[type] = 0
    }
    for (const job of initialJobs) {
      if (job.type) {
        const normalized = job.type.trim().toLowerCase()
        const matchedType = JOB_TYPES.find((t) => t.toLowerCase() === normalized)
        if (matchedType) {
          counts[matchedType] = (counts[matchedType] || 0) + 1
        } else {
          counts[job.type] = (counts[job.type] || 0) + 1
        }
      }
    }
    return counts
  }, [initialJobs])

  // Dynamically calculate actual job counts from the backend data for each Category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    for (const cat of JOB_CATEGORIES) {
      counts[cat] = 0
    }
    for (const job of initialJobs) {
      if (job.category) {
        const normalized = job.category.trim().toLowerCase()
        const matchedCat = JOB_CATEGORIES.find((c) => c.toLowerCase() === normalized)
        if (matchedCat) {
          counts[matchedCat] = (counts[matchedCat] || 0) + 1
        } else {
          counts[job.category] = (counts[job.category] || 0) + 1
        }
      }
    }
    return counts
  }, [initialJobs])

  // Combined Search, Filtering, and Sorting Pipeline
  const filteredJobs = React.useMemo(() => {
    let result = [...initialJobs]

    // 1. Search Query Filter
    const query = searchQuery.trim().toLowerCase()
    if (query) {
      result = result.filter((job) => {
        const titleMatch = job.title?.toLowerCase().includes(query)
        const companyMatch = job.company?.toLowerCase().includes(query)
        const categoryMatch = job.category?.toLowerCase().includes(query)
        const locationMatch = `${job.city || ""} ${job.country || ""}`
          .toLowerCase()
          .includes(query)
        const respMatch = job.responsibilities?.toLowerCase().includes(query)
        const reqMatch = job.requirements?.toLowerCase().includes(query)
        return (
          titleMatch ||
          companyMatch ||
          categoryMatch ||
          locationMatch ||
          respMatch ||
          reqMatch
        )
      })
    }

    // 2. Job Type Single-Select Filter
    if (selectedJobType) {
      const typeLower = selectedJobType.toLowerCase()
      result = result.filter((job) => job.type?.toLowerCase() === typeLower)
    }

    // 3. Category Single-Select Filter
    if (selectedCategory) {
      const catLower = selectedCategory.toLowerCase()
      result = result.filter((job) => job.category?.toLowerCase() === catLower)
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortOption === "Most Recent") {
        const dateA = a.datePosted ? new Date(a.datePosted).getTime() : 0
        const dateB = b.datePosted ? new Date(b.datePosted).getTime() : 0
        return dateB - dateA
      }
      if (sortOption === "Oldest") {
        const dateA = a.datePosted ? new Date(a.datePosted).getTime() : 0
        const dateB = b.datePosted ? new Date(b.datePosted).getTime() : 0
        return dateA - dateB
      }
      if (sortOption === "Highest Salary") {
        const salaryA = Number(a.salaryMax) || Number(a.salaryMin) || 0
        const salaryB = Number(b.salaryMax) || Number(b.salaryMin) || 0
        return salaryB - salaryA
      }
      if (sortOption === "Most Relevant") {
        if (query) {
          const aTitleScore = a.title?.toLowerCase().includes(query) ? 2 : 0
          const bTitleScore = b.title?.toLowerCase().includes(query) ? 2 : 0
          return bTitleScore - aTitleScore
        }
        return 0
      }
      return 0
    })

    return result
  }, [initialJobs, searchQuery, selectedJobType, selectedCategory, sortOption])

  const handleClearFilters = () => {
    setSelectedJobType(null)
    setSelectedCategory(null)
    setSearchQuery("")
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Search Header */}
      <SearchHeader
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={setSearchQuery}
      />

      {/* Main Content Area: Sidebar Filters + Job List Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterSidebar
              selectedJobType={selectedJobType}
              selectedCategory={selectedCategory}
              jobTypeCounts={jobTypeCounts}
              categoryCounts={categoryCounts}
              onSelectJobType={setSelectedJobType}
              onSelectCategory={setSelectedCategory}
              onClearFilters={handleClearFilters}
            />
          </div>
        </aside>

        {/* Mobile Filter Drawer / Collapsible */}
        {mobileFilterOpen && (
          <div className="lg:hidden">
            <FilterSidebar
              selectedJobType={selectedJobType}
              selectedCategory={selectedCategory}
              jobTypeCounts={jobTypeCounts}
              categoryCounts={categoryCounts}
              onSelectJobType={(type) => {
                setSelectedJobType(type)
                setMobileFilterOpen(false)
              }}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat)
                setMobileFilterOpen(false)
              }}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}

        {/* Main Job Listing Section */}
        <section className="flex flex-col gap-6">
          <JobListHeader
            totalCount={filteredJobs.length}
            selectedSort={sortOption}
            onSortChange={setSortOption}
            onToggleMobileFilter={() => setMobileFilterOpen(!mobileFilterOpen)}
          />

          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#141415] py-20 text-center">
              <div className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40">
                <Briefcase className="size-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">
                No job postings found
              </h3>
              <p className="mt-1 max-w-sm text-xs text-white/50">
                Try selecting different filter options or adjusting your search keywords.
              </p>
              {(Boolean(selectedJobType) || Boolean(selectedCategory) || Boolean(searchQuery)) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Clear All Filters</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredJobs.map((job) => (
                <JobCard key={job._id || `${job.title}-${job.company}`} job={job} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
