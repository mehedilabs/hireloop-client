"use client"

import { useEffect, useMemo, useState } from "react"
import { Bookmark, RefreshCw } from "lucide-react"

import { useSession } from "@/lib/auth-client"
import { getMySavedJobs, type SavedJob } from "@/lib/api/saved-jobs"
import { getMyApplications } from "@/lib/api/applications"
import { removeSavedJob } from "@/lib/actions/saved-jobs"

import { SavedJobsStats } from "./_components/SavedJobsStats"
import { SavedJobsFilters } from "./_components/SavedJobsFilters"
import { SavedJobCard } from "./_components/SavedJobCard"
import { SavedJobsPagination } from "./_components/SavedJobsPagination"

const PAGE_SIZE = 5

interface SavedJobsData {
  userId: string
  jobs: SavedJob[]
  appliedJobIds: string[]
}

interface SavedJobsError {
  userId: string
  message: string
}

const SavedJobsPage = () => {
  const { data: session, isPending } = useSession()
  const userId = session?.user?.id

  const [savedData, setSavedData] = useState<SavedJobsData | null>(null)
  const [loadError, setLoadError] = useState<SavedJobsError | null>(null)
  const [actionError, setActionError] = useState("")
  const [removingSavedJobId, setRemovingSavedJobId] = useState<string | null>(
    null
  )

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [sortOption, setSortOption] = useState("Recently Saved")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!userId) return

    let ignore = false

    const loadSavedJobs = async () => {
      try {
        const [savedJobsData, applications] = await Promise.all([
          getMySavedJobs(userId),
          getMyApplications(userId),
        ])

        if (!ignore) {
          setSavedData({
            userId,
            jobs: savedJobsData,
            appliedJobIds: applications.map((application) => application.jobId),
          })

          setLoadError(null)
        }
      } catch {
        if (!ignore) {
          setLoadError({
            userId,
            message: "Failed to load saved jobs. Please try again.",
          })
        }
      }
    }

    loadSavedJobs()

    return () => {
      ignore = true
    }
  }, [userId])

  const savedJobs = useMemo<SavedJob[]>(() => {
    return savedData?.userId === userId ? (savedData?.jobs ?? []) : []
  }, [savedData, userId])

  const error =
    loadError && loadError.userId === userId ? loadError.message : ""

  const isLoading =
    isPending || (!!userId && savedData?.userId !== userId && !error)

  const handleRemove = async (savedJobId: string) => {
    if (!userId || removingSavedJobId) return

    try {
      setActionError("")
      setRemovingSavedJobId(savedJobId)

      await removeSavedJob(savedJobId)

      setSavedData((current) => {
        if (!current || current.userId !== userId) return current

        return {
          ...current,
          jobs: current.jobs.filter((item) => item._id !== savedJobId),
        }
      })
    } catch {
      setActionError("Failed to remove saved job. Please try again.")
    } finally {
      setRemovingSavedJobId(null)
    }
  }

  const handleApplied = (jobId: string) => {
    setSavedData((current) => {
      if (!current || current.userId !== userId) return current

      return {
        ...current,
        appliedJobIds: [...new Set([...current.appliedJobIds, jobId])],
      }
    })
  }

  const filteredSavedJobs = useMemo(() => {
    let result = [...savedJobs]

    const query = searchQuery.trim().toLowerCase()

    if (query) {
      result = result.filter(({ job }) => {
        return (
          job.title?.toLowerCase().includes(query) ||
          job.company?.toLowerCase().includes(query) ||
          job.category?.toLowerCase().includes(query) ||
          job.city?.toLowerCase().includes(query) ||
          job.country?.toLowerCase().includes(query)
        )
      })
    }

    if (categoryFilter !== "All") {
      result = result.filter(
        ({ job }) =>
          job.category?.toLowerCase() === categoryFilter.toLowerCase()
      )
    }

    result.sort((a, b) => {
      const dateA = new Date(a.savedAt).getTime() || 0
      const dateB = new Date(b.savedAt).getTime() || 0

      if (sortOption === "Oldest Saved") {
        return dateA - dateB
      }

      if (sortOption === "Closing Soon") {
        const deadlineA = a.job.deadline
          ? new Date(a.job.deadline).getTime()
          : Infinity

        const deadlineB = b.job.deadline
          ? new Date(b.job.deadline).getTime()
          : Infinity

        return deadlineA - deadlineB
      }

      return dateB - dateA
    })

    return result
  }, [savedJobs, searchQuery, categoryFilter, sortOption])

  const totalPages = Math.ceil(filteredSavedJobs.length / PAGE_SIZE)
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1))

  const paginatedSavedJobs = filteredSavedJobs.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  )

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortOption(value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[#0c0c0d] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {isLoading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#141415]">
            <RefreshCw className="size-6 animate-spin text-white/50" />
            <p className="text-sm text-white/50">Loading your saved jobs...</p>
          </div>
        ) : !userId ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#141415] px-5 text-center">
            <Bookmark className="size-8 text-white/35" />

            <h2 className="mt-4 text-base font-semibold text-white">
              Sign in to view saved jobs
            </h2>

            <p className="mt-2 max-w-sm text-sm text-white/45">
              Your bookmarked opportunities will appear here after you sign in.
            </p>
          </div>
        ) : error ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#141415] px-5 text-center">
            <p className="text-sm text-red-400">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#141415] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Bookmark className="size-5 text-white/75" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Saved Jobs
                  </h1>

                  <p className="mt-1 text-xs text-white/50 sm:text-sm">
                    Manage and keep track of your bookmarked opportunities.
                  </p>
                </div>
              </div>

              <SavedJobsStats savedJobs={savedJobs} />
            </div>

            <SavedJobsFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              categoryFilter={categoryFilter}
              onCategoryChange={handleCategoryChange}
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />

            {actionError && (
              <p className="text-sm text-red-400">{actionError}</p>
            )}

            {filteredSavedJobs.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#141415] px-5 text-center">
                <div className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Bookmark className="size-6 text-white/40" />
                </div>

                <h2 className="mt-4 text-base font-semibold text-white">
                  {savedJobs.length === 0
                    ? "No saved jobs yet"
                    : "No matching jobs found"}
                </h2>

                <p className="mt-2 max-w-sm text-sm text-white/45">
                  {savedJobs.length === 0
                    ? "When you bookmark a job from Browse Jobs, it will appear here."
                    : "Try changing your search or category filter to find your saved jobs."}
                </p>

                {savedJobs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("")
                      setCategoryFilter("All")
                      setCurrentPage(1)
                    }}
                    className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/55">
                    <span className="font-semibold text-white">
                      {filteredSavedJobs.length}
                    </span>{" "}
                    {filteredSavedJobs.length === 1 ? "job" : "jobs"} found
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {paginatedSavedJobs.map((savedJob) => (
                    <SavedJobCard
                      key={savedJob._id}
                      savedJob={savedJob}
                      isRemoving={removingSavedJobId === savedJob._id}
                      isApplied={
                        savedData?.appliedJobIds.includes(savedJob.jobId) ??
                        false
                      }
                      onRemove={handleRemove}
                      onApplied={handleApplied}
                    />
                  ))}
                </div>

                <SavedJobsPagination
                  currentPage={safeCurrentPage}
                  totalItems={filteredSavedJobs.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SavedJobsPage
