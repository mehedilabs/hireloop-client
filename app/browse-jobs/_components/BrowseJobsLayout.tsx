"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Briefcase, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { getMySavedJobs, type SavedJob } from "@/lib/api/saved-jobs"
import { saveJob, removeSavedJob } from "@/lib/actions/saved-jobs"
import { JOB_CATEGORIES, JOB_TYPES, type JobPost } from "@/lib/jobs"

import { SearchHeader } from "./SearchHeader"
import { FilterSidebar } from "./FilterSidebar"
import { JobListHeader } from "./JobListHeader"
import { JobCard } from "./JobCard"

interface BrowseJobsLayoutProps {
  initialJobs: JobPost[]
}

interface SearchDraftProps {
  initialValue: string
  onSearch: (value: string) => void
}

const JOBS_PER_PAGE = 6

function SearchDraft({ initialValue, onSearch }: SearchDraftProps) {
  const [draftSearch, setDraftSearch] = React.useState(initialValue)

  return (
    <SearchHeader
      value={draftSearch}
      onChange={setDraftSearch}
      onSearch={onSearch}
    />
  )
}

function isRemoteJob(job: JobPost): boolean {
  return (
    job.remote === true ||
    String(job.remote).trim().toLowerCase() === "true" ||
    job.type?.trim().toLowerCase() === "remote" ||
    Boolean(job.type?.toLowerCase().includes("remote"))
  )
}

function matchesJobType(job: JobPost, targetType: string): boolean {
  const target = targetType.trim().toLowerCase()

  if (target === "remote") {
    return isRemoteJob(job)
  }

  return job.type?.trim().toLowerCase() === target
}

function matchesCategory(job: JobPost, targetCat: string): boolean {
  return job.category?.trim().toLowerCase() === targetCat.trim().toLowerCase()
}

export function BrowseJobsLayout({ initialJobs }: BrowseJobsLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { data: session, isPending: isSessionPending } = authClient.useSession()

  const userId = session?.user?.id

  const [savedJobs, setSavedJobs] = React.useState<SavedJob[]>([])
  const [savingJobId, setSavingJobId] = React.useState<string | null>(null)
  const [savedJobsUserId, setSavedJobsUserId] = React.useState<string | null>(
    null
  )

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)

  const urlSearch = searchParams.get("search") ?? searchParams.get("q") ?? ""
  const selectedJobType = searchParams.get("type") || null
  const selectedCategory = searchParams.get("category") || null
  const sortOption = searchParams.get("sort") || "Most Recent"

  const searchQuery = urlSearch

  // Load saved jobs for the logged-in user
  React.useEffect(() => {
    if (isSessionPending) return

    if (!userId) return

    let isActive = true

    const loadSavedJobs = async () => {
      try {
        const result = await getMySavedJobs(userId)

        if (isActive) {
          setSavedJobs(result)
          setSavedJobsUserId(userId)
        }
      } catch (error) {
        console.error("Failed to load saved jobs:", error)
      }
    }

    loadSavedJobs()

    return () => {
      isActive = false
    }
  }, [userId, isSessionPending])

  // Save or remove a job from saved jobs
  const handleSaveToggle = async (job: JobPost) => {
    if (!userId || savingJobId) return

    setSavingJobId(job._id)

    try {
      const existingSavedJob = savedJobs.find(
        (savedJob) => savedJob.jobId === job._id
      )

      if (existingSavedJob) {
        await removeSavedJob(existingSavedJob._id)
      } else {
        await saveJob({
          userId,
          jobId: job._id,
        })
      }

      const updatedSavedJobs = await getMySavedJobs(userId)
      setSavedJobs(updatedSavedJobs)
    } catch (error) {
      console.error("Failed to update saved job:", error)
    } finally {
      setSavingJobId(null)
    }
  }

  // Update URL query parameters while preserving existing parameters
  const updateQueryParams = React.useCallback(
    (
      updates: Record<string, string | null | undefined>,
      options?: { replace?: boolean }
    ) => {
      const params = new URLSearchParams(searchParams.toString())

      if ("search" in updates) {
        params.delete("q")
      }

      Object.entries(updates).forEach(([key, val]) => {
        if (val && val.trim() !== "") {
          params.set(key, val.trim())
        } else {
          params.delete(key)
        }
      })

      const queryString = params.toString()
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname

      if (options?.replace) {
        router.replace(targetUrl, { scroll: false })
      } else {
        router.push(targetUrl, { scroll: false })
      }
    },
    [pathname, router, searchParams]
  )

  // Handlers
  const handleSearchSubmit = (val: string) => {
    setCurrentPage(1)
    updateQueryParams({ search: val })
  }

  const handleSelectJobType = (type: string | null) => {
    setCurrentPage(1)
    updateQueryParams({ type })
  }

  const handleSelectCategory = (cat: string | null) => {
    setCurrentPage(1)
    updateQueryParams({ category: cat })
  }

  const handleSortChange = (sort: string) => {
    setCurrentPage(1)
    updateQueryParams({ sort: sort === "Most Recent" ? null : sort })
  }

  const handleClearFilters = () => {
    setCurrentPage(1)
    updateQueryParams({
      search: null,
      type: null,
      category: null,
      sort: null,
    })
  }

  // Dynamically calculate actual job counts from backend data
  const jobTypeCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}

    for (const type of JOB_TYPES) {
      counts[type] = initialJobs.filter((job) =>
        matchesJobType(job, type)
      ).length
    }

    return counts
  }, [initialJobs])

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}

    for (const cat of JOB_CATEGORIES) {
      counts[cat] = initialJobs.filter((job) =>
        matchesCategory(job, cat)
      ).length
    }

    return counts
  }, [initialJobs])

  // Search, Filtering, and Sorting
  const filteredJobs = React.useMemo(() => {
    let result = [...initialJobs]

    // Search
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

    // Job Type
    if (selectedJobType) {
      result = result.filter((job) => matchesJobType(job, selectedJobType))
    }

    // Category
    if (selectedCategory) {
      result = result.filter((job) => matchesCategory(job, selectedCategory))
    }

    // Sorting
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

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE)

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  )

  const visiblePages = React.useMemo(() => {
    const pages = new Set([
      1,
      totalPages,
      currentPage - 1,
      currentPage,
      currentPage + 1,
    ])

    return [...pages]
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b)
  }, [currentPage, totalPages])

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Search Header */}
      <SearchDraft
        key={urlSearch}
        initialValue={urlSearch}
        onSearch={handleSearchSubmit}
      />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterSidebar
              selectedJobType={selectedJobType}
              selectedCategory={selectedCategory}
              jobTypeCounts={jobTypeCounts}
              categoryCounts={categoryCounts}
              onSelectJobType={handleSelectJobType}
              onSelectCategory={handleSelectCategory}
              onClearFilters={handleClearFilters}
            />
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden">
            <FilterSidebar
              selectedJobType={selectedJobType}
              selectedCategory={selectedCategory}
              jobTypeCounts={jobTypeCounts}
              categoryCounts={categoryCounts}
              onSelectJobType={(type) => {
                handleSelectJobType(type)
                setMobileFilterOpen(false)
              }}
              onSelectCategory={(cat) => {
                handleSelectCategory(cat)
                setMobileFilterOpen(false)
              }}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}

        {/* Main Job Listing */}
        <section className="flex flex-col gap-6">
          <JobListHeader
            totalCount={filteredJobs.length}
            selectedSort={sortOption}
            onSortChange={handleSortChange}
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
                Try selecting different filter options or adjusting your search
                keywords.
              </p>

              {(Boolean(selectedJobType) ||
                Boolean(selectedCategory) ||
                Boolean(searchQuery)) && (
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
            <>
              {/* One job card per row */}
              <div className="flex flex-col gap-4">
                {paginatedJobs.map((job) => {
                  const isSaved =
                    savedJobsUserId === userId &&
                    savedJobs.some((savedJob) => savedJob.jobId === job._id)

                  return (
                    <JobCard
                      key={job._id || `${job.title}-${job.company}`}
                      job={job}
                      isSaved={isSaved}
                      isSaving={savingJobId === job._id}
                      isAuthenticated={Boolean(userId) && !isSessionPending}
                      onSaveToggle={() => handleSaveToggle(job)}
                    />
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4" />
                  </button>

                  {visiblePages.map((page, index) => {
                    const previousPage = visiblePages[index - 1]

                    return (
                      <React.Fragment key={page}>
                        {previousPage && page - previousPage > 1 && (
                          <span className="px-1 text-sm text-white/50">
                            ...
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          aria-label={`Go to page ${page}`}
                          aria-current={
                            currentPage === page ? "page" : undefined
                          }
                          className={`flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "border-white bg-white text-black"
                              : "border-white/10 text-white hover:bg-white/10"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    )
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
