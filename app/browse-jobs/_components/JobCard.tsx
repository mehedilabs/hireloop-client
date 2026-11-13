"use client"

import Link from "next/link"
import { Bookmark, Briefcase, DollarSign, MapPin } from "lucide-react"

import { CategoryTile } from "@/app/components/jobs/CategoryTile"
import { Chip } from "@/app/components/jobs/Chip"
import { StatusBadge } from "@/app/components/jobs/StatusBadge"
import {
  formatLocation,
  formatSalary,
  getJobStatus,
  type JobPost,
} from "@/lib/jobs"
import { cn } from "@/lib/utils"

interface JobCardProps {
  job: JobPost
  isSaved: boolean
  isSaving: boolean
  isAuthenticated: boolean
  onSaveToggle: () => void
}

export function JobCard({
  job,
  isSaved,
  isSaving,
  isAuthenticated,
  onSaveToggle,
}: JobCardProps) {
  const status = getJobStatus(job)
  const formattedSalary = formatSalary(job)
  const location = formatLocation(job, "Remote / Flexible")

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#141415] p-5 transition-all hover:border-[#5c53fe]/40 hover:bg-[#161618] hover:shadow-lg hover:shadow-black/40">
      <div className="flex flex-col gap-4">
        {/* Top row: Category/Company logo + Title/Company + Save icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3.5">
            <CategoryTile
              category={job.category}
              className="size-11 shrink-0 rounded-xl"
            />

            <div className="flex min-w-0 flex-col gap-1">
              <Link
                href={`/browse-jobs/${job._id || ""}`}
                className="line-clamp-1 text-base font-semibold text-white transition-colors group-hover:text-[#c3c0ff] hover:text-[#c3c0ff]"
              >
                {job.title}
              </Link>

              <p className="flex flex-wrap items-center gap-1.5 text-xs text-white/50">
                <span className="font-medium text-white/80">
                  {job.company || "HireLoop Partner"}
                </span>

                <span>•</span>

                <span className="flex items-center gap-1">
                  <MapPin className="size-3 shrink-0 text-white/40" />
                  {location}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSaveToggle}
            disabled={!isAuthenticated || isSaving}
            aria-label={
              !isAuthenticated
                ? "Sign in to save jobs"
                : isSaved
                  ? "Remove saved job"
                  : "Save job"
            }
            aria-pressed={isSaved}
            title={
              !isAuthenticated
                ? "Sign in to save jobs"
                : isSaved
                  ? "Remove from saved jobs"
                  : "Save job"
            }
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              isSaved
                ? "border-[#5c53fe] bg-[#5c53fe]/20 text-[#c3c0ff]"
                : "border-white/10 bg-[#1a1a1d] text-white/40 hover:border-white/20 hover:text-white"
            )}
          >
            <Bookmark className={cn("size-4", isSaved && "fill-current")} />
          </button>
        </div>

        {/* Salary + Job Type + Remote / Status */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {formattedSalary && formattedSalary !== "Not specified" && (
            <Chip
              icon={DollarSign}
              className="border-white/10 bg-white/5 text-white/80"
            >
              {formattedSalary}
            </Chip>
          )}

          {job.type && (
            <Chip
              icon={Briefcase}
              className="border-white/10 bg-white/5 text-white/80"
            >
              {job.type}
            </Chip>
          )}

          {job.remote && (
            <span className="inline-flex items-center rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-400">
              Remote
            </span>
          )}

          {status && <StatusBadge status={status} />}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[11px] text-white/40">
          {job.applicants
            ? `${job.applicants} applied`
            : "Be an early applicant"}
        </span>

        <Link
          href={`/browse-jobs/${job._id || ""}`}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-[#5c53fe]/40 bg-[#5c53fe]/10 px-3.5 text-xs font-semibold text-[#c3c0ff] transition-all hover:border-[#5c53fe] hover:bg-[#5c53fe] hover:text-white"
        >
          View Details
        </Link>
      </div>
    </article>
  )
}
