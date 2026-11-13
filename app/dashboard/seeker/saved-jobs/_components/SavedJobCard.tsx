"use client"

import Link from "next/link"
import {
  BookmarkCheck,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Trash2,
} from "lucide-react"

import type { SavedJob } from "@/lib/api/saved-jobs"
import { formatLocation, formatSalary } from "@/lib/jobs"
import { CategoryTile } from "@/app/components/jobs/CategoryTile"
import { ApplyNowButton } from "@/app/browse-jobs/[id]/_components/ApplyNowButton"

interface SavedJobCardProps {
  savedJob: SavedJob
  isRemoving: boolean
  isApplied: boolean
  onRemove: (savedJobId: string) => void
  onApplied: (jobId: string) => void
}

function formatDate(date: string) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return "Recently"

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate)
}

export function SavedJobCard({
  savedJob,
  isRemoving,
  isApplied,
  onRemove,
  onApplied,
}: SavedJobCardProps) {
  const { job } = savedJob

  const deadline = job.deadline ? new Date(job.deadline) : null

  const validDeadline =
    deadline && !Number.isNaN(deadline.getTime()) ? deadline : null

  const daysLeft = validDeadline
    ? Math.ceil(
        (validDeadline.getTime() - new Date().setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      )
    : null

  const isClosed =
    job.status === "expired" || (daysLeft !== null && daysLeft < 0)

  const formattedSalary = formatSalary(job)
  const location = formatLocation(job, "Remote / Flexible")

  return (
    <article
      className={`rounded-2xl border border-white/10 bg-[#141415] p-4 transition-colors sm:p-5 ${
        isClosed ? "opacity-65" : "hover:border-white/20"
      }`}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <CategoryTile
            category={job.category}
            className="size-12 shrink-0 rounded-xl"
          />

          <div className="min-w-0 flex-1">
            <Link
              href={`/browse-jobs/${job._id}`}
              className="line-clamp-2 text-base font-semibold text-white transition-colors hover:text-[#c3c0ff]"
            >
              {job.title}
            </Link>

            <p className="mt-1 text-sm font-medium text-white/70">
              {job.company || "HireLoop Partner"}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/45">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" />
                {location}
              </span>

              {job.type && (
                <span className="inline-flex items-center gap-1">
                  <BriefcaseBusiness className="size-3.5" />
                  {job.type}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(savedJob._id)}
            disabled={isRemoving}
            aria-label="Remove saved job"
            title="Remove from saved jobs"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/45 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {formattedSalary && formattedSalary !== "Not specified" && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
              {formattedSalary}
            </span>
          )}

          {job.category && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
              {job.category}
            </span>
          )}

          {job.remote && (
            <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs text-sky-400">
              Remote
            </span>
          )}

          {isClosed ? (
            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
              Closed
            </span>
          ) : daysLeft !== null && daysLeft <= 7 ? (
            <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400">
              {daysLeft === 0 ? "Closes today" : `Closes in ${daysLeft} days`}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-white/40">
            <span className="inline-flex items-center gap-1.5">
              <BookmarkCheck className="size-3.5" />
              Saved {formatDate(savedJob.savedAt)}
            </span>

            {validDeadline && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                Deadline {formatDate(job.deadline)}
              </span>
            )}
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Link
              href={`/browse-jobs/${job._id}`}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-white/10 px-4 text-xs font-semibold text-white/75 transition hover:bg-white/10"
            >
              View Details
            </Link>

            {!isClosed && (
              <div className="w-full sm:w-32">
                <ApplyNowButton
                  job={job}
                  isApplied={isApplied}
                  onApplied={() => onApplied(job._id)}
                  redirectOnSuccess={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
