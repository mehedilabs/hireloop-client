"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  ChevronDown,
  Globe,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Clock,
  Users,
} from "lucide-react"

import ApplicationStatusSummary, {
  STATUS_OPTIONS,
  statusDots,
  statusStyles,
} from "@/app/dashboard/recruiter/_components/application-status-summary"

import { getApplicationsByJobId } from "@/lib/api/applications"
import { getJobById } from "@/lib/api/jobs"
import { updateApplicationStatus } from "@/lib/actions/applications"
import type {
  ApplicationStatus,
  JobApplication,
} from "@/lib/types/applications"
import type { JobPost } from "@/lib/jobs"
import { toast } from "@/components/ui/toast"

const statusAccents: Record<ApplicationStatus, string> = {
  Applied: "before:bg-blue-400/70",
  Review: "before:bg-yellow-400/70",
  Shortlisted: "before:bg-purple-400/70",
  Interview: "before:bg-cyan-400/70",
  Offered: "before:bg-green-400/70",
  Rejected: "before:bg-red-400/70",
}

const AVATAR_GRADIENTS = [
  "from-[#5b4fe9] to-[#8b7cff]",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-400",
  "from-fuchsia-500 to-purple-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
]

const getAvatarGradient = (value: string) => {
  let hash = 0

  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) % AVATAR_GRADIENTS.length
  }

  return AVATAR_GRADIENTS[hash]
}

const infoPill =
  "flex min-w-0 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-2 text-[11px] text-[#c4c4cc] sm:rounded-full sm:py-1 sm:text-xs"

export default function JobApplicationsPage() {
  const params = useParams<{ id: string }>()
  const jobId = params.id

  const [job, setJob] = useState<JobPost | null>(null)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<
    ApplicationStatus | "All"
  >("All")

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true)
        setError("")

        const [jobData, applicationData] = await Promise.all([
          getJobById(jobId),
          getApplicationsByJobId(jobId),
        ])

        setJob(jobData)
        setApplications(applicationData)
      } catch (error) {
        console.error("Failed to load job applications:", error)
        setError("Could not load applications. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      loadApplications()
    }
  }, [jobId])

  const handleStatusChange = async (
    applicationId: string,
    status: ApplicationStatus
  ) => {
    try {
      setUpdatingId(applicationId)

      await updateApplicationStatus(applicationId, status)

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? { ...application, status }
            : application
        )
      )

      toast.add({
        title: "Status Updated",
        description: `Application status changed to ${status}.`,
      })
    } catch (error) {
      console.error("Failed to update application status:", error)

      toast.add({
        title: "Update Failed",
        description: "Could not update application status.",
        type: "error",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const formatApplicationDate = (date: string) => {
    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date"
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const filteredApplications =
    selectedStatus === "All"
      ? applications
      : applications.filter(
          (application) => application.status === selectedStatus
        )

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0d0d10] px-3 py-4 text-white sm:px-6 sm:py-8 lg:px-8">
      {/* Page background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-[#5b4fe9]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl">
        <Link
          href={`/dashboard/recruiter/jobs/${jobId}`}
          className="group inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-[#a0a0ab] transition-colors hover:border-white/15 hover:text-white"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Job Details
        </Link>

        {/* Header */}
        <header className="relative mt-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#18181d] to-[#111114] p-4 shadow-xl shadow-black/30 sm:p-6">
          <div className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-[#5b4fe9]/25 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:28px_28px]" />

          <div className="relative flex items-center gap-3 sm:gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#5b4fe9] to-[#8b7cff] text-white shadow-lg shadow-[#5b4fe9]/40 sm:size-12">
              <Users className="size-5 sm:size-6" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold tracking-widest text-[#a79cf8] uppercase">
                Recruiter Dashboard
              </p>

              <h1 className="mt-0.5 text-lg font-semibold tracking-tight sm:text-2xl">
                Job Applications
              </h1>

              <p className="mt-0.5 truncate text-xs text-[#8a8a95] sm:text-sm">
                {job?.title || "Manage and review your applicants"}
              </p>
            </div>

            <div className="shrink-0 rounded-xl border border-[#5b4fe9]/30 bg-[#5b4fe9]/10 px-3 py-2 text-center sm:px-5">
              <p className="text-xl leading-none font-bold text-white sm:text-3xl">
                {applications.length}
              </p>

              <p className="mt-1 text-[10px] text-[#a79cf8]">
                {applications.length === 1 ? "Applicant" : "Applicants"}
              </p>
            </div>
          </div>

          {/* Job information */}
          <div className="relative mt-4 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-4 sm:flex sm:flex-wrap sm:items-center">
            <span className={infoPill}>
              <Briefcase className="size-3.5 shrink-0 text-[#a79cf8]" />
              <span className="truncate">{job?.company || "Company"}</span>
            </span>

            {job?.category && (
              <span className={infoPill}>
                <Layers className="size-3.5 shrink-0 text-[#a79cf8]" />
                <span className="truncate">{job.category}</span>
              </span>
            )}

            {job?.type && (
              <span className={infoPill}>
                <Clock className="size-3.5 shrink-0 text-[#a79cf8]" />
                <span className="truncate">{job.type}</span>
              </span>
            )}

            <span className={infoPill}>
              {job?.remote ? (
                <Globe className="size-3.5 shrink-0 text-[#a79cf8]" />
              ) : (
                <MapPin className="size-3.5 shrink-0 text-[#a79cf8]" />
              )}

              <span className="truncate">
                {job?.remote ? "Remote" : "On-site"}
              </span>
            </span>
          </div>
        </header>

        {/* Reusable Status Summary */}
        {!loading && !error && applications.length > 0 && (
          <div className="mt-3">
            <ApplicationStatusSummary
              applications={applications}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </div>
        )}

        {/* Applications */}
        <section className="mt-4">
          {!loading && !error && applications.length > 0 && (
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-white">
                Applicants
                <span className="ml-2 text-xs font-normal text-[#8a8a95]">
                  ({filteredApplications.length})
                </span>
              </h2>

              <button
                type="button"
                onClick={() => setSelectedStatus("All")}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedStatus === "All"
                    ? "border-[#5b4fe9]/40 bg-[#5b4fe9]/15 text-[#b5adff]"
                    : "border-white/10 bg-white/[0.03] text-[#a0a0ab] hover:text-white"
                }`}
              >
                All Applications
              </button>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-white/[0.06] bg-[#151517] p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-white/5" />

                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/2 rounded bg-white/5" />
                      <div className="h-2.5 w-1/3 rounded bg-white/5" />
                    </div>

                    <div className="hidden h-10 w-[180px] rounded-lg bg-white/5 sm:block" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] px-4 py-12 text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#151517] px-4 py-16 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#5b4fe9]/10">
                <Users className="size-7 text-[#a79cf8]" />
              </div>

              <h2 className="mt-4 text-sm font-semibold text-white">
                No Applications Yet
              </h2>

              <p className="mt-1 text-xs text-[#8a8a95]">
                Applications for this job will appear here.
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#151517] px-4 py-12 text-center">
              <Users className="mx-auto size-8 text-[#55555f]" />

              <h2 className="mt-3 text-sm font-semibold text-white">
                No {selectedStatus} Applications
              </h2>

              <p className="mt-1 text-xs text-[#8a8a95]">
                No applicants found with this status.
              </p>

              <button
                type="button"
                onClick={() => setSelectedStatus("All")}
                className="mt-4 text-xs font-medium text-[#a79cf8] hover:text-white"
              >
                View All Applications
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplications.map((application, index) => (
                <article
                  key={application._id || `${application.userId}-${index}`}
                  className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#151517] p-4 pl-5 transition-all before:absolute before:top-0 before:left-0 before:h-full before:w-1 hover:border-white/[0.12] hover:bg-[#18181b] hover:shadow-lg hover:shadow-black/30 sm:p-5 sm:pl-6 ${statusAccents[application.status]}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Applicant information */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-md ${getAvatarGradient(application.email)}`}
                      >
                        {application.email.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-white sm:text-[15px]">
                          {application.email}
                        </h2>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8a8a95] sm:text-xs">
                          <span className="flex items-center gap-1">
                            <Mail className="size-3" />
                            Applicant
                          </span>

                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-3" />
                            {formatApplicationDate(application.appliedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1.5 sm:min-w-[180px] sm:items-end">
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-[#777780] uppercase">
                        Application Status
                        {updatingId === application._id && (
                          <Loader2 className="size-3 animate-spin text-[#a79cf8]" />
                        )}
                      </span>

                      <div className="relative w-full sm:w-[180px]">
                        <span
                          className={`pointer-events-none absolute top-1/2 left-3 size-2 -translate-y-1/2 rounded-full ${statusDots[application.status]}`}
                        />

                        <select
                          value={application.status}
                          disabled={
                            !application._id || updatingId === application._id
                          }
                          onChange={(e) =>
                            application._id &&
                            handleStatusChange(
                              application._id,
                              e.target.value as ApplicationStatus
                            )
                          }
                          className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-[#1c1c20] pr-9 pl-8 text-xs font-medium text-white transition-colors outline-none hover:border-white/20 focus:border-[#5b4fe9] focus:ring-2 focus:ring-[#5b4fe9]/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-[#1c1c20] text-white"
                            >
                              {status}
                            </option>
                          ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#8a8a95]" />
                      </div>
                    </div>
                  </div>

                  {/* Job information */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
                    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-[#a0a0ab]">
                      {application.category}
                    </span>

                    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-[#a0a0ab]">
                      {application.jobType}
                    </span>

                    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-[#a0a0ab]">
                      {application.remote ? "Remote" : "On-site"}
                    </span>

                    <span
                      className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusStyles[application.status]}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${statusDots[application.status]}`}
                      />

                      {application.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
