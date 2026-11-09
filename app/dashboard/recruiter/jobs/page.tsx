"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronRight,
  Code,
  DollarSign,
  Headphones,
  MapPin,
  Megaphone,
  Palette,
  Pencil,
  Plus,
  Settings,
  TrendingUp,
  Trash2,
  Users,
  MoreVertical,
  type LucideIcon,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type JobPost, type JobStatus } from "@/lib/jobs"
import { cn } from "@/lib/utils"
import { getJobs } from "@/lib/api/jobs"

const CATEGORY_STYLES: Record<string, { color: string; icon: LucideIcon }> = {
  Engineering: { color: "#38bdf8", icon: Code },
  Design: { color: "#f97316", icon: Palette },
  Marketing: { color: "#c3c0ff", icon: Megaphone },
  Sales: { color: "#4ade80", icon: TrendingUp },
  Finance: { color: "#fbbf24", icon: DollarSign },
  "Customer Support": { color: "#22d3ee", icon: Headphones },
  "Human Resources": { color: "#f472b6", icon: Users },
  Operations: { color: "#818cf8", icon: Settings },
}

const STATUS_CLASSES: Record<JobStatus, string> = {
  Active: "bg-[#14532d]/40 text-[#4ade80]",
  Closed: "bg-[#1f1f1f] text-[#a0a0ab]",
  Draft: "bg-[#5c53fe]/15 text-[#c3c0ff]",
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  PHP: "₱",
  USD: "$",
  EUR: "€",
  GBP: "£",
  SGD: "S$",
}

const COLUMNS = [
  "Job Title & Dept",
  "Company & Location",
  "Type",
  "Compensation",
  "Applicants",
  "Status",
  "Deadline",
  "Actions",
] as const

function categoryStyle(category: string) {
  return (
    CATEGORY_STYLES[category] ?? {
      color: "#a0a0ab",
      icon: Settings,
    }
  )
}

function formatDate(iso: string) {
  if (!iso) return "—"

  const [y, m, d] = iso.split("-").map(Number)

  if (!y || !m || !d) return iso

  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

function formatSalary(job: JobPost) {
  const symbol = CURRENCY_SYMBOLS[job.currency] ?? job.currency
  const min = Number(job.salaryMin)
  const max = Number(job.salaryMax)

  if (!min && !max) return "Not specified"

  const fmt = (n: number) => n.toLocaleString("en-US")

  if (min && max) {
    return `${symbol}${fmt(min)} – ${symbol}${fmt(max)}`
  }

  return `${symbol}${fmt(min || max)}`
}

function formatLocation(job: JobPost) {
  const place = [job.city, job.country].filter(Boolean).join(", ")

  if (job.remote) return place ? `Remote (${place})` : "Remote"

  return place || "—"
}

function formatPosted(datePosted: string, now: number | null) {
  if (!now) return ""

  const days = Math.floor((now - new Date(datePosted).getTime()) / 86400000)

  if (days <= 0) return "Posted today"
  if (days === 1) return "Posted 1d ago"
  if (days < 7) return `Posted ${days}d ago`

  const weeks = Math.floor(days / 7)

  if (weeks < 5) return `Posted ${weeks}w ago`

  return `Posted ${Math.floor(days / 30)}mo ago`
}

let clientNow: number | null = null

const readNow = () => (clientNow ??= Date.now())
const subscribeNow = () => () => {}
const serverNow = () => null

function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center gap-1.5 rounded-full px-2 text-[10px] font-medium whitespace-nowrap",
        STATUS_CLASSES[status]
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export default function ManageJobsPage() {
  const [jobs, setJobs] = React.useState<JobPost[]>([])
  const [confirmId, setConfirmId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs()
        setJobs(data)
      } catch (error) {
        console.error("Failed to load jobs:", error)
      }
    }

    fetchJobs()
  }, [])

  const now = React.useSyncExternalStore(subscribeNow, readNow, serverNow)

  const toggleStatus = (id: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job._id === id
          ? {
              ...job,
              status: job.status === "Active" ? "Closed" : "Active",
            }
          : job
      )
    )

    setConfirmId(null)
  }

  const removeJob = (id: string) => {
    setJobs((prev) => prev.filter((job) => job._id !== id))
    setConfirmId(null)
  }

  const subLabel = (job: JobPost) =>
    job.status === "Active" ? formatPosted(job.datePosted, now) : job.status

  const actions = (job: JobPost) => {
    const confirming = confirmId === job._id

    return (
      <div className="flex items-center justify-end gap-1.5">
        <Link
          href={`/dashboard/recruiter/jobs/new?edit=${job._id}`}
          className="inline-flex h-7 items-center gap-1 rounded-md bg-[#5c53fe]/20 px-2 text-[10px] font-medium text-[#c3c0ff] hover:bg-[#5c53fe]/30"
        >
          <Pencil className="size-3" />
          Update
        </Link>

        <button
          type="button"
          onClick={() => {
            if (confirming) removeJob(job._id)
            else setConfirmId(job._id)
          }}
          className={cn(
            "flex size-7 items-center justify-center rounded-md",
            confirming
              ? "bg-red-500/15 text-red-400"
              : "bg-[#1f1f22] text-[#a0a0ab] hover:text-red-400"
          )}
          title={confirming ? "Confirm delete" : "Delete"}
        >
          <Trash2 className="size-3.5" />
        </button>

        <button
          type="button"
          className="flex size-6 items-center justify-center text-[#8a8a95] hover:text-white"
          aria-label={`More actions for ${job.title}`}
        >
          <MoreVertical className="size-4" />
        </button>
      </div>
    )
  }
  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#131314] px-3 py-4 sm:px-5 sm:py-5 lg:px-6"
      onClick={() => setConfirmId(null)}
    >
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px]">
          <span className="text-[#8a8a95]">Manage Jobs</span>
          <ChevronRight className="size-3 text-[#5a5a60]" />
          <span className="font-medium text-[#c3c0ff]">
            Job Listings &amp; Postings
          </span>
        </nav>

        {/* Page Heading */}
        <header className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[24px] font-semibold tracking-tight text-white sm:text-[27px]">
              Manage Job Posts
            </h1>

            <p className="mt-1 text-[11px] leading-relaxed text-[#8a8a95] sm:text-[12px]">
              Review live listings, monitor applicants, and update job details
              across your organization.
            </p>
          </div>

          <Link
            href="/dashboard/recruiter/jobs/new"
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[#5c53fe] px-3 text-[11px] font-semibold text-white shadow-lg shadow-[#5c53fe]/20 transition-colors hover:bg-[#6c61f0]"
          >
            <Plus className="size-3.5" />
            New Job Post
          </Link>
        </header>

        {/* Jobs Table */}
        <div className="mt-5 w-full overflow-hidden rounded-xl border border-[#232327] bg-[#151516] shadow-xl shadow-black/20">
          {jobs.length === 0 ? (
            <p className="px-4 py-12 text-center text-[12px] text-[#8a8a95]">
              No job posts yet.
            </p>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden w-full md:block">
                <Table className="w-full table-fixed text-left">
                  <colgroup>
                    <col style={{ width: "19%" }} />
                    <col style={{ width: "19%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "12%" }} />
                  </colgroup>

                  <TableHeader className="bg-[#0e0e0f] [&_tr]:border-b [&_tr]:border-[#232327]">
                    <TableRow className="hover:bg-transparent">
                      {COLUMNS.map((column) => (
                        <TableHead
                          key={column}
                          className={cn(
                            "h-9 overflow-hidden bg-[#0e0e0f] px-2 text-[9px] font-semibold tracking-[0.04em] whitespace-nowrap text-[#8a8a95] uppercase sm:px-2.5",
                            column === "Actions" && "text-right"
                          )}
                        >
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {jobs.map((job) => {
                      const { color, icon: Icon } = categoryStyle(job.category)

                      return (
                        <TableRow
                          key={job._id}
                          className="h-[56px] border-b border-[#232327] transition-colors last:border-b-0 hover:bg-white/[0.025]"
                        >
                          {/* Job Title */}
                          <TableCell className="overflow-hidden px-2 py-2 sm:px-2.5">
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className="flex size-7 shrink-0 items-center justify-center rounded-md border border-white/[0.06]"
                                style={{
                                  color,
                                  backgroundColor: `${color}1a`,
                                }}
                              >
                                <Icon className="size-3.5" />
                              </span>

                              <div className="min-w-0">
                                <div className="truncate text-[11px] font-semibold text-white">
                                  {job.title}
                                </div>

                                <div
                                  className="mt-0.5 truncate text-[9px] font-medium"
                                  style={{ color }}
                                >
                                  {job.category}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          {/* Company & Location */}
                          <TableCell className="overflow-hidden px-2">
                            <div className="truncate text-[11px] font-medium text-white">
                              {job.company}
                            </div>

                            <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[9px] text-[#8a8a95]">
                              <MapPin className="size-3 shrink-0" />

                              <span className="truncate">
                                {formatLocation(job)}
                              </span>
                            </div>
                          </TableCell>

                          {/* Type */}
                          <TableCell className="overflow-hidden px-2">
                            <span className="inline-flex h-6 max-w-full items-center truncate rounded-full border border-[#2a2a2f] bg-[#1c1c1f] px-2 text-[9px] font-medium whitespace-nowrap text-[#d4d4d8]">
                              {job.type}
                            </span>
                          </TableCell>

                          {/* Compensation */}
                          <TableCell className="overflow-hidden px-2">
                            <span className="block truncate text-[10px] font-medium text-white">
                              {formatSalary(job)}
                            </span>
                          </TableCell>

                          {/* Applicants */}
                          <TableCell className="overflow-hidden px-2">
                            <span className="flex min-w-0 items-center gap-1 text-[10px] font-semibold text-[#c3c0ff]">
                              <Users className="size-3.5 shrink-0" />

                              <span className="truncate">
                                {job.applicants} Candidates
                              </span>
                            </span>
                          </TableCell>

                          {/* Status */}
                          <TableCell className="overflow-hidden px-2">
                            <StatusBadge status={job.status} />
                          </TableCell>

                          {/* Deadline */}
                          <TableCell className="overflow-hidden px-2">
                            <div
                              className={cn(
                                "truncate text-[10px] font-medium",
                                job.status === "Active"
                                  ? "text-white"
                                  : "text-[#a0a0ab]"
                              )}
                            >
                              {formatDate(job.deadline)}
                            </div>

                            <div className="mt-0.5 truncate text-[9px] text-[#5a5a60]">
                              {subLabel(job)}
                            </div>
                          </TableCell>

                          {/* Actions */}
                          <TableCell
                            className="overflow-hidden px-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {actions(job)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y divide-[#232327] md:hidden">
                {jobs.map((job) => {
                  const { color, icon: Icon } = categoryStyle(job.category)

                  return (
                    <div key={job._id} className="p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span
                            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06]"
                            style={{
                              color,
                              backgroundColor: `${color}1a`,
                            }}
                          >
                            <Icon className="size-4" />
                          </span>

                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-semibold text-white">
                              {job.title}
                            </div>

                            <div
                              className="mt-0.5 text-[10px] font-medium"
                              style={{ color }}
                            >
                              {job.category}
                            </div>
                          </div>
                        </div>

                        <StatusBadge status={job.status} />
                      </div>

                      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 rounded-lg border border-[#232327] bg-[#0e0e0f] p-3">
                        {[
                          ["Company", job.company],
                          ["Location", formatLocation(job)],
                          ["Type", job.type],
                          ["Compensation", formatSalary(job)],
                          ["Applicants", `${job.applicants} Candidates`],
                          ["Deadline", formatDate(job.deadline)],
                        ].map(([label, value]) => (
                          <div key={label} className="min-w-0">
                            <dt className="text-[9px] font-semibold tracking-wider text-[#5a5a60] uppercase">
                              {label}
                            </dt>

                            <dd className="mt-0.5 truncate text-[11px] text-[#d4d4d8]">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <div
                        className="mt-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {actions(job)}
                      </div>
                    </div>
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
