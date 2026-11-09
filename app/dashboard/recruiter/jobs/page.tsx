"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronRight,
  Code,
  DollarSign,
  Eye,
  Headphones,
  MapPin,
  Megaphone,
  Palette,
  Pencil,
  Plus,
  Power,
  Settings,
  TrendingUp,
  Trash2,
  Users,
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
import { DUMMY_JOBS, type JobPost, type JobStatus } from "@/lib/jobs"
import { cn } from "@/lib/utils"

/** Category colour + icon, taken from the Figma rows. */
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
  return CATEGORY_STYLES[category] ?? { color: "#a0a0ab", icon: Settings }
}

/** "2026-12-30" -> "Dec 30, 2026" without any timezone shifting. */
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
  if (min && max) return `${symbol}${fmt(min)} – ${symbol}${fmt(max)}`
  return `${symbol}${fmt(min || max)}`
}

function formatLocation(job: JobPost) {
  const place = [job.city, job.country].filter(Boolean).join(", ")
  if (job.remote) return place ? `Remote (${place})` : "Remote"
  return place || "—"
}

/** "Posted 4d ago" — needs `now` so the server and client render the same text. */
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

// Timestamp read only in the browser. The server snapshot is null so SSR and
// the first client render agree, then React re-renders with the real value —
// no effect, no hydration mismatch.
let clientNow: number | null = null
const readNow = () => (clientNow ??= Date.now())
const subscribeNow = () => () => {}
const serverNow = () => null

function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium whitespace-nowrap",
        STATUS_CLASSES[status]
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export default function ManageJobsPage() {
  const [jobs, setJobs] = React.useState<JobPost[]>(DUMMY_JOBS)
  const [confirmId, setConfirmId] = React.useState<string | null>(null)
  // null on the server, the real time on the client (see readNow above).
  const now = React.useSyncExternalStore(subscribeNow, readNow, serverNow)

  const toggleStatus = (id: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, status: job.status === "Active" ? "Closed" : "Active" }
          : job
      )
    )
    setConfirmId(null)
  }

  const removeJob = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id))
    setConfirmId(null)
  }

  const subLabel = (job: JobPost) =>
    job.status === "Active" ? formatPosted(job.datePosted, now) : job.status

  const actions = (job: JobPost) => {
    const confirming = confirmId === job.id
    return (
      <div className="flex items-center gap-1.5 md:justify-end">
        <Link
          href={`/dashboard/recruiter/jobs/new?edit=${job.id}`}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#5c53fe]/25 bg-[#5c53fe]/15 px-3 text-[12px] font-medium text-[#c3c0ff] transition-colors hover:bg-[#5c53fe]/30"
        >
          <Pencil className="size-3.5" />
          Update
        </Link>

        <Link
          href="/dashboard/recruiter/applications"
          aria-label={`View applicants for ${job.title}`}
          title="View applicants"
          className="inline-flex size-8 items-center justify-center rounded-lg bg-[#1f1f22] text-[#a0a0ab] transition-colors hover:bg-[#2a2a2f] hover:text-white"
        >
          <Eye className="size-4" />
        </Link>

        <button
          type="button"
          onClick={() => toggleStatus(job.id)}
          aria-label={
            job.status === "Active"
              ? `Close ${job.title}`
              : `Reopen ${job.title}`
          }
          title={job.status === "Active" ? "Close job" : "Reopen job"}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg bg-[#1f1f22] text-[#a0a0ab] transition-colors hover:bg-[#2a2a2f] hover:text-white"
        >
          <Power className="size-4" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (confirming) removeJob(job.id)
            else setConfirmId(job.id)
          }}
          aria-label={
            confirming ? `Confirm delete ${job.title}` : `Delete ${job.title}`
          }
          title={confirming ? "Click again to confirm" : "Delete job"}
          className={cn(
            "inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-[12px] font-medium transition-colors",
            confirming
              ? "bg-red-500/15 px-2.5 text-red-400"
              : "w-8 bg-[#1f1f22] text-[#a0a0ab] hover:bg-red-500/10 hover:text-red-400"
          )}
        >
          <Trash2 className="size-4" />
          {confirming ? "Sure?" : null}
        </button>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#131314] px-4 py-6 sm:px-6 lg:px-8"
      onClick={() => setConfirmId(null)}
    >
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px]">
          <span className="text-[#8a8a95]">Manage Jobs</span>
          <ChevronRight className="size-3 text-[#5a5a60]" />
          <span className="font-medium text-[#c3c0ff]">
            Job Listings &amp; Postings
          </span>
        </nav>

        {/* Page heading */}
        <header className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[26px] font-semibold tracking-tight text-white sm:text-[30px]">
              Manage Job Posts
            </h1>
            <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-[#8a8a95]">
              Review live listings, monitor applicants, and update job details
              across your organization.
            </p>
          </div>

          <Link
            href="/dashboard/recruiter/jobs/new"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#5c53fe] px-4 text-[13px] font-semibold text-white shadow-lg shadow-[#5c53fe]/20 transition-colors hover:bg-[#6c61f0]"
          >
            <Plus className="size-4" />
            New Job Post
          </Link>
        </header>

        {/* Work surface */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#232327] bg-[#151516] shadow-xl shadow-black/20">
          {jobs.length === 0 ? (
            <p className="px-6 py-16 text-center text-[13px] text-[#5a5a60]">
              No job posts yet.
            </p>
          ) : (
            <>
              {/* Desktop: scrollable table */}
              <div className="hidden overflow-x-auto md:block">
                <Table className="min-w-[1020px]">
                  <TableHeader className="bg-[#0e0e0f] [&_tr]:border-b [&_tr]:border-[#232327]">
                    <TableRow className="hover:bg-transparent">
                      {COLUMNS.map((column) => (
                        <TableHead
                          key={column}
                          className={cn(
                            "h-12 bg-[#0e0e0f] px-4 text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap text-[#8a8a95] uppercase first:pl-5 last:pr-5",
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
                          key={job.id}
                          className="h-[68px] border-b border-[#232327] transition-colors last:border-b-0 hover:bg-white/[0.025]"
                        >
                          {/* Job title & dept */}
                          <TableCell className="px-4 py-3 first:pl-5">
                            <div className="flex items-center gap-3">
                              <span
                                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06]"
                                style={{ color, backgroundColor: `${color}1a` }}
                              >
                                <Icon className="size-4" />
                              </span>
                              <div className="min-w-0">
                                <div className="truncate text-[13px] font-semibold text-white">
                                  {job.title}
                                </div>
                                <div
                                  className="mt-0.5 text-[11px] font-medium"
                                  style={{ color }}
                                >
                                  {job.category}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          {/* Company & location */}
                          <TableCell className="px-4">
                            <div className="text-[13px] font-medium text-white">
                              {job.company}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#8a8a95]">
                              <MapPin className="size-3.5 shrink-0" />
                              <span className="truncate">
                                {formatLocation(job)}
                              </span>
                            </div>
                          </TableCell>

                          {/* Type */}
                          <TableCell className="px-4">
                            <span className="inline-flex h-7 items-center rounded-full border border-[#2a2a2f] bg-[#1c1c1f] px-3 text-[11px] font-medium whitespace-nowrap text-[#d4d4d8]">
                              {job.type}
                            </span>
                          </TableCell>

                          {/* Compensation */}
                          <TableCell className="px-4 text-[13px] font-medium whitespace-nowrap text-white">
                            {formatSalary(job)}
                          </TableCell>

                          {/* Applicants */}
                          <TableCell className="px-4">
                            <span className="flex items-center gap-2 text-[13px] font-semibold whitespace-nowrap text-[#c3c0ff]">
                              <Users className="size-4" />
                              {job.applicants} Candidates
                            </span>
                          </TableCell>

                          {/* Status */}
                          <TableCell className="px-4">
                            <StatusBadge status={job.status} />
                          </TableCell>

                          {/* Deadline */}
                          <TableCell className="px-4">
                            <div
                              className={cn(
                                "text-[13px] font-medium whitespace-nowrap",
                                job.status === "Active"
                                  ? "text-white"
                                  : "text-[#a0a0ab]"
                              )}
                            >
                              {formatDate(job.deadline)}
                            </div>
                            <div className="mt-1 text-[11px] whitespace-nowrap text-[#5a5a60]">
                              {subLabel(job)}
                            </div>
                          </TableCell>

                          {/* Actions */}
                          <TableCell
                            className="px-4 last:pr-5"
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

              {/* Mobile: stacked cards */}
              <div className="divide-y divide-[#232327] md:hidden">
                {jobs.map((job) => {
                  const { color, icon: Icon } = categoryStyle(job.category)
                  return (
                    <div key={job.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.06]"
                            style={{ color, backgroundColor: `${color}1a` }}
                          >
                            <Icon className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-[14px] font-semibold text-white">
                              {job.title}
                            </div>
                            <div
                              className="mt-0.5 text-[11px] font-medium"
                              style={{ color }}
                            >
                              {job.category}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={job.status} />
                      </div>

                      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-[#232327] bg-[#0e0e0f] p-3.5">
                        {[
                          ["Company", job.company],
                          ["Location", formatLocation(job)],
                          ["Type", job.type],
                          ["Compensation", formatSalary(job)],
                          ["Applicants", `${job.applicants} Candidates`],
                          ["Deadline", formatDate(job.deadline)],
                        ].map(([label, value]) => (
                          <div key={label} className="min-w-0">
                            <dt className="text-[10px] font-semibold tracking-wider text-[#5a5a60] uppercase">
                              {label}
                            </dt>
                            <dd className="mt-0.5 truncate text-[13px] text-[#d4d4d8]">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <div
                        className="mt-4"
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
