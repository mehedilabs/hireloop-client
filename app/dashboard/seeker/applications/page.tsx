"use client"

import { useEffect, useState } from "react"

import { useSession } from "@/lib/auth-client"
import { getMyApplications } from "@/lib/api/applications"
import { updateApplicationArchive } from "@/lib/actions/applications"
import type {
  ApplicationStatus,
  JobApplication,
} from "@/lib/types/applications"

import { ApplicationFilters } from "./_components/ApplicationFilters"
import { ApplicationPagination } from "./_components/ApplicationPagination"
import { ApplicationsTable } from "./_components/ApplicationsTable"
import { ApplicationStats } from "./_components/ApplicationStats"
import { ApplicationTabs } from "./_components/ApplicationTabs"

const PAGE_SIZE = 5

const MyApplicationsPage = () => {
  const { data: session, isPending } = useSession()

  const [applications, setApplications] = useState<JobApplication[] | null>(
    null
  )
  const [error, setError] = useState("")
  const [actionError, setActionError] = useState("")
  const [updatingApplicationId, setUpdatingApplicationId] = useState<
    string | null
  >(null)

  const [activeTab, setActiveTab] = useState<"active" | "archived">("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">(
    "All"
  )
  const [currentPage, setCurrentPage] = useState(1)

  const userId = session?.user?.id

  useEffect(() => {
    if (!userId) return

    let ignore = false

    const loadApplications = async () => {
      try {
        const data = await getMyApplications(userId)

        if (!ignore) {
          setApplications(data)
        }
      } catch {
        if (!ignore) {
          setError("Failed to load applications.")
        }
      }
    }

    loadApplications()

    return () => {
      ignore = true
    }
  }, [userId])

  const handleArchiveToggle = async (application: JobApplication) => {
    if (!application._id) return

    const isArchived = !application.isArchived

    try {
      setActionError("")
      setUpdatingApplicationId(application._id)

      await updateApplicationArchive(application._id, isArchived)

      setApplications(
        (current) =>
          current?.map((item) =>
            item._id === application._id ? { ...item, isArchived } : item
          ) ?? null
      )
    } catch {
      setActionError("Failed to update application. Please try again.")
    } finally {
      setUpdatingApplicationId(null)
    }
  }

  const isLoading = isPending || (!!userId && applications === null && !error)

  const filteredApplications = (applications ?? [])
    .filter((application) =>
      activeTab === "archived"
        ? application.isArchived === true
        : application.isArchived !== true
    )
    .filter((application) => {
      const search = searchQuery.trim().toLowerCase()

      return (
        (application.jobTitle ?? "").toLowerCase().includes(search) ||
        (application.companyName ?? "").toLowerCase().includes(search)
      )
    })
    .filter(
      (application) =>
        statusFilter === "All" || application.status === statusFilter
    )

  const totalPages = Math.ceil(filteredApplications.length / PAGE_SIZE)
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1))

  const paginatedApplications = filteredApplications.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  )

  const handleTabChange = (tab: "active" | "archived") => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: ApplicationStatus | "All") => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[#0c0c0d] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Applications
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Track your job applications and interview progress
          </p>
        </div>

        <ApplicationStats applications={applications ?? []} />

        <ApplicationTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <ApplicationFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
        />

        {actionError && <p className="text-sm text-red-400">{actionError}</p>}

        {isLoading ? (
          <p className="py-10 text-center text-sm text-white/50">
            Loading applications...
          </p>
        ) : error ? (
          <p className="py-10 text-center text-sm text-red-400">{error}</p>
        ) : !userId ? (
          <p className="py-10 text-center text-sm text-white/50">
            Please sign in to view your applications.
          </p>
        ) : (
          <ApplicationsTable
            applications={paginatedApplications}
            onArchiveToggle={handleArchiveToggle}
            updatingApplicationId={updatingApplicationId}
          />
        )}

        <ApplicationPagination
          currentPage={safeCurrentPage}
          totalItems={filteredApplications.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default MyApplicationsPage
