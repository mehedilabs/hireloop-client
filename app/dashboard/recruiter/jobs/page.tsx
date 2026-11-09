import Link from "next/link"
import {
  Code,
  DollarSign,
  Headphones,
  Eye,
  MapPin,
  Megaphone,
  Palette,
  Pencil,
  Plus,
  Settings,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"

import { type JobPost, type JobStatus } from "@/lib/jobs"
import { cn } from "@/lib/utils"
import { getJobs } from "@/lib/api/jobs"
import { DeleteJobDialog } from "@/app/components/DeleteDialog"
import { EditJobDialog } from "@/app/components/EditJobDialog"

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

const headingClass =
  "px-4 py-4 text-xs font-semibold tracking-wide text-white/50 uppercase"

const cellClass = "px-4 py-4"

const iconButtonClass =
  "flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#1A1A1F] text-white/60 transition-all hover:border-[#5c53fe]/50 hover:bg-[#5c53fe]/10 hover:text-white"

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

function formatPosted(datePosted: string) {
  if (!datePosted) return ""

  const days = Math.floor(
    (Date.now() - new Date(datePosted).getTime()) / 86400000
  )

  if (days <= 0) return "Posted today"
  if (days === 1) return "Posted 1d ago"
  if (days < 7) return `Posted ${days}d ago`

  const weeks = Math.floor(days / 7)

  if (weeks < 5) return `Posted ${weeks}w ago`

  return `Posted ${Math.floor(days / 30)}mo ago`
}

function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center gap-1.5 rounded-full px-2.5 text-[10px] font-medium whitespace-nowrap",
        STATUS_CLASSES[status]
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export default async function ManageJobsPage() {
  const jobs: JobPost[] = await getJobs()

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#131314] px-3 py-5 sm:px-5 sm:py-7 lg:px-6">
      <div className="mx-auto w-full max-w-[1400px]">
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <span className="text-white/50">Manage Jobs</span>
          <span aria-hidden className="text-white/30">
            /
          </span>
          <span className="font-medium text-[#c3c0ff]">
            Job Listings &amp; Postings
          </span>
        </nav>

        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1.5">
            <h1 className="text-[25px] font-bold tracking-tight text-white sm:text-[28px]">
              Manage Job Posts
            </h1>

            <p className="max-w-2xl text-xs leading-relaxed text-white/50 sm:text-sm">
              Review live listings, monitor applicants, and update job details
              across your organization.
            </p>
          </div>

          <Link
            href="/dashboard/recruiter/jobs/new"
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-[#5c53fe] px-4 text-xs font-semibold text-white shadow-lg shadow-[#5c53fe]/20 transition-all hover:bg-[#6c61f0] sm:text-sm"
          >
            <Plus className="size-4" />
            New Job Post
          </Link>
        </header>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010]/95 shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)]">
          {jobs.length === 0 ? (
            <p className="px-4 py-16 text-center text-sm text-white/50">
              No job posts yet.
            </p>
          ) : (
            <>
              {/* Desktop Table - hidden on mobile */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full table-fixed text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#151516]">
                      <th
                        scope="col"
                        className={cn(headingClass, "w-[20%] px-5")}
                      >
                        Job Title &amp; Dept
                      </th>

                      <th scope="col" className={cn(headingClass, "w-[16%]")}>
                        Company &amp; Location
                      </th>

                      <th scope="col" className={cn(headingClass, "w-[9%]")}>
                        Type
                      </th>

                      <th scope="col" className={cn(headingClass, "w-[12%]")}>
                        Compensation
                      </th>

                      <th scope="col" className={cn(headingClass, "w-[12%]")}>
                        Applicants
                      </th>

                      <th scope="col" className={cn(headingClass, "w-[9%]")}>
                        Status
                      </th>

                      <th scope="col" className={cn(headingClass, "w-[11%]")}>
                        Deadline
                      </th>

                      <th
                        scope="col"
                        className={cn(headingClass, "w-[11%] px-5")}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.map((job) => {
                      const { color, icon: Icon } = categoryStyle(job.category)

                      return (
                        <tr
                          key={job._id}
                          className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.03]"
                        >
                          <td className={cn(cellClass, "px-5")}>
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] text-sm font-semibold"
                                style={{
                                  color,
                                  backgroundColor: `${color}1a`,
                                }}
                                aria-hidden
                              >
                                <Icon className="size-4" />
                              </span>

                              <div className="flex min-w-0 flex-col gap-1">
                                <span className="truncate font-medium text-[#EDEDEF]">
                                  {job.title}
                                </span>

                                <span
                                  className="truncate text-xs"
                                  style={{ color }}
                                >
                                  {job.category}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className={cellClass}>
                            <div className="flex min-w-0 flex-col gap-1">
                              <span className="truncate text-[#EDEDEF]">
                                {job.company}
                              </span>

                              <span className="truncate text-xs text-white/50">
                                {formatLocation(job)}
                              </span>
                            </div>
                          </td>

                          <td className={cellClass}>
                            <span className="inline-flex items-center rounded-lg border border-white/10 bg-[#1A1A1F] px-2.5 py-1 text-xs whitespace-nowrap text-white/80 capitalize">
                              {job.type}
                            </span>
                          </td>

                          <td className={cellClass}>
                            <span className="whitespace-nowrap text-white/80">
                              {formatSalary(job)}
                            </span>
                          </td>

                          <td className={cellClass}>
                            <span className="flex items-center gap-2 whitespace-nowrap text-white/80">
                              <Users className="size-4 shrink-0 text-white/40" />
                              {job.applicants} Candidates
                            </span>
                          </td>

                          <td className={cellClass}>
                            <StatusBadge status={job.status} />
                          </td>

                          <td className={cellClass}>
                            <div className="flex flex-col gap-1 whitespace-nowrap">
                              <span
                                className={cn(
                                  "text-[#EDEDEF]",
                                  job.status !== "Active" && "text-white/50"
                                )}
                              >
                                {formatDate(job.deadline)}
                              </span>

                              <span className="text-xs text-white/50">
                                {job.status === "Active"
                                  ? formatPosted(job.datePosted)
                                  : job.status}
                              </span>
                            </div>
                          </td>

                          <td className={cn(cellClass, "px-5")}>
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                href={`/dashboard/recruiter/jobs/${job._id}`}
                                aria-label={`View ${job.title}`}
                                className={iconButtonClass}
                              >
                                <Eye aria-hidden className="size-4" />
                              </Link>

                              <EditJobDialog job={job} />

                              <DeleteJobDialog job={job} />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards - only visible on mobile */}
              <div className="divide-y divide-white/10 md:hidden">
                {jobs.map((job) => {
                  const { color, icon: Icon } = categoryStyle(job.category)

                  return (
                    <div key={job._id} className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.06]"
                            style={{
                              color,
                              backgroundColor: `${color}1a`,
                            }}
                          >
                            <Icon className="size-4" />
                          </span>

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-white">
                              {job.title}
                            </h3>

                            <p
                              className="mt-1 truncate text-xs font-medium"
                              style={{ color }}
                            >
                              {job.category}
                            </p>
                          </div>
                        </div>

                        <StatusBadge status={job.status} />
                      </div>

                      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 rounded-xl border border-white/10 bg-[#0e0e0f] p-3.5">
                        <div className="min-w-0">
                          <dt className="text-[10px] font-medium tracking-wide text-white/40 uppercase">
                            Company
                          </dt>

                          <dd className="mt-1 truncate text-xs font-medium text-white/85">
                            {job.company}
                          </dd>
                        </div>

                        <div className="min-w-0">
                          <dt className="text-[10px] font-medium tracking-wide text-white/40 uppercase">
                            Location
                          </dt>

                          <dd className="mt-1 flex min-w-0 items-center gap-1 text-xs text-white/80">
                            <MapPin className="size-3 shrink-0 text-white/40" />
                            <span className="truncate">
                              {formatLocation(job)}
                            </span>
                          </dd>
                        </div>

                        <div className="min-w-0">
                          <dt className="text-[10px] font-medium tracking-wide text-white/40 uppercase">
                            Type
                          </dt>

                          <dd className="mt-1 truncate text-xs text-white/80">
                            {job.type}
                          </dd>
                        </div>

                        <div className="min-w-0">
                          <dt className="text-[10px] font-medium tracking-wide text-white/40 uppercase">
                            Compensation
                          </dt>

                          <dd className="mt-1 truncate text-xs text-white/80">
                            {formatSalary(job)}
                          </dd>
                        </div>

                        <div className="min-w-0">
                          <dt className="text-[10px] font-medium tracking-wide text-white/40 uppercase">
                            Applicants
                          </dt>

                          <dd className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
                            <Users className="size-3.5 text-white/40" />
                            {job.applicants} Candidates
                          </dd>
                        </div>

                        <div className="min-w-0">
                          <dt className="text-[10px] font-medium tracking-wide text-white/40 uppercase">
                            Deadline
                          </dt>

                          <dd className="mt-1 truncate text-xs text-white/80">
                            {formatDate(job.deadline)}
                          </dd>
                        </div>
                      </dl>

                      <p className="mt-2.5 text-[10px] text-white/40">
                        {job.status === "Active"
                          ? formatPosted(job.datePosted)
                          : job.status}
                      </p>

                      <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
                        <Link
                          href={`/dashboard/recruiter/jobs/${job._id}`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-[#1A1A1F] px-3 text-xs font-medium text-white/70 transition-colors hover:border-[#5c53fe]/50 hover:text-white"
                        >
                          <Eye className="size-3.5" />
                          View
                        </Link>

                        <EditJobDialog job={job} showLabel />

                        <DeleteJobDialog job={job} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
