// Single shared home for everything job-related: types, option lists,
// category/status styling maps, and formatting helpers. The "Post a Job"
// form, the Manage Jobs table, the job details page and the edit dialog all
// import from here so they can never drift apart.
import {
  Code,
  DollarSign,
  Headphones,
  Megaphone,
  Palette,
  Settings,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"

/* ---------- types ---------- */

export type JobStatus = "Active" | "expired"

/** Exactly the shape the Post a Job form collects (also sent to the API). */
export type JobForm = {
  title: string
  category: string
  type: string
  salaryMin: string
  salaryMax: string
  currency: string
  city: string
  country: string
  remote: boolean
  deadline: string
  responsibilities: string
  requirements: string
  benefits: string
  status: JobStatus
  applicants: number
  company: string
  salaryFrequency: string
}

/** A saved job post: the form data plus what the API/table adds. */
export type JobPost = JobForm & {
  _id: string
  company: string
  /** ISO date the post went live, e.g. "2026-11-05" */
  datePosted: string
}

export const initialForm: JobForm = {
  title: "",
  category: "",
  type: "",
  salaryMin: "",
  salaryMax: "",
  currency: "PHP",
  city: "",
  country: "",
  remote: false,
  deadline: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  applicants: 0,
  status: "Active",
  company: "",
  salaryFrequency: "per hour",
}

/* ---------- option lists ---------- */

export const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Customer Support",
  "Human Resources",
  "Operations",
]

export const JOB_TYPES = ["Full-time", "Part-time", "Remote", "Contract", "Internship"]

export const CURRENCIES = ["PHP", "USD", "EUR", "GBP", "SGD"]

/* ---------- styling maps ---------- */

/** Colour + icon per job category (falls back to a neutral grey). */
export const CATEGORY_STYLES: Record<string, { color: string; icon: LucideIcon }> = {
  Engineering: { color: "#38bdf8", icon: Code },
  Design: { color: "#f97316", icon: Palette },
  Marketing: { color: "#c3c0ff", icon: Megaphone },
  Sales: { color: "#4ade80", icon: TrendingUp },
  Finance: { color: "#fbbf24", icon: DollarSign },
  "Customer Support": { color: "#22d3ee", icon: Headphones },
  "Human Resources": { color: "#f472b6", icon: Users },
  Operations: { color: "#818cf8", icon: Settings },
}

export function categoryStyle(category: string) {
  return (
    CATEGORY_STYLES[category] ?? {
      color: "#a0a0ab",
      icon: Settings,
    }
  )
}

/** Tailwind classes for each status pill. */
export const STATUS_CLASSES: Record<JobStatus, string> = {
  Active: "bg-[#14532d]/40 text-[#4ade80]",
  expired: "bg-[#1f1f1f] text-[#a0a0ab]",
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  PHP: "₱",
  USD: "$",
  EUR: "€",
  GBP: "£",
  SGD: "S$",
}

/* ---------- formatting helpers ---------- */

/** "2026-12-30" -> Date at local midnight, or null when unparseable. */
export function parseIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

/** "2026-12-30" -> "Dec 30, 2026" without any timezone shifting. */
export function formatDate(iso: string) {
  if (!iso) return "—"

  const date = parseIso(iso)
  if (!date) return iso

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export function formatSalary(job: JobPost) {
  const symbol = CURRENCY_SYMBOLS[job.currency] ?? job.currency
  const min = Number(job.salaryMin)
  const max = Number(job.salaryMax)

  if (!min && !max) return "Not specified"

  const fmt = (n: number) => n.toLocaleString("en-US")

  if (min && max) return `${symbol}${fmt(min)} – ${symbol}${fmt(max)}`

  return `${symbol}${fmt(min || max)}`
}

/** Compact place string; pass `fallback` to control the empty text. */
export function formatLocation(job: JobPost, fallback = "—") {
  const place = [job.city, job.country].filter(Boolean).join(", ")

  if (job.remote) return place ? `Remote (${place})` : "Remote"

  return place || fallback
}

/**
 * "Posted Nd ago". Pass `long` for the details-page wording
 * ("Posted 1 day ago") instead of the compact table wording ("Posted 1d ago").
 */
export function formatPosted(iso?: string, long = false) {
  if (!iso) return ""

  const date = parseIso(iso)
  if (!date) return ""

  const days = Math.floor((Date.now() - date.getTime()) / 86400000)
  const unit = long ? " day" : "d"

  if (days <= 0) return "Posted today"
  if (days === 1) return long ? "Posted 1 day ago" : "Posted 1d ago"
  if (days < 7) return `Posted ${days}${unit}${long ? "s" : ""} ago`

  const weeks = Math.floor(days / 7)

  if (weeks < 5) return `Posted ${weeks}w ago`

  return `Posted ${Math.floor(days / 30)}mo ago`
}

/** A post whose deadline has passed shows as "expired" regardless of status. */
export function getJobStatus(job: JobPost): JobStatus {
  if (job.status === "expired") return "expired"
  if (job.status !== "Active" || !job.deadline) return job.status

  const deadlineDate = parseIso(job.deadline)
  if (!deadlineDate) return job.status

  const today = new Date()
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  return deadlineDate < todayDate ? "expired" : "Active"
}

/** Human countdown for a deadline ("3 days left", "Closes today", ...). */
export function deadlineInfo(iso: string) {
  if (!iso) {
    return { text: "Open until filled", className: "text-[#8a8a95]" }
  }

  const end = parseIso(iso)
  if (!end) return { text: "", className: "" }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = Math.round((end.getTime() - today.getTime()) / 86400000)

  if (days < 0) return { text: "Deadline passed", className: "text-red-400" }
  if (days === 0) return { text: "Closes today", className: "text-amber-400" }
  if (days <= 7)
    return { text: `${days} days left`, className: "text-amber-400" }

  return { text: `${days} days left`, className: "text-[#8a8a95]" }
}

/* ---------- form helpers ---------- */

/** Prefill the Post a Job form shape from a saved post (edit dialog). */
export function getFormData(job: JobPost): JobForm {
  return {
    title: job.title ?? "",
    category: job.category ?? "",
    type: job.type ?? "",
    salaryMin: job.salaryMin ?? "",
    salaryMax: job.salaryMax ?? "",
    currency: job.currency ?? "PHP",
    city: job.city ?? "",
    country: job.country ?? "",
    remote: job.remote ?? false,
    deadline: job.deadline ?? "",
    responsibilities: job.responsibilities ?? "",
    requirements: job.requirements ?? "",
    benefits: job.benefits ?? "",
    status: job.status ?? "Active",
    applicants: job.applicants ?? 0,
    company: job.company ?? "",
    salaryFrequency: job.salaryFrequency ?? "per hour",
  }
}
