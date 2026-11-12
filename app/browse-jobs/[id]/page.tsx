import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarClock,
  Check,
  Clock,
  DollarSign,
  Gift,
  Globe,
  MapPin,
  Share2,
  ShieldCheck,
  Users,
} from "lucide-react"

import { ApplyNowButton } from "./_components/ApplyNowButton"
import { CategoryTile } from "@/app/components/jobs/CategoryTile"
import { StatusBadge } from "@/app/components/jobs/StatusBadge"
import SiteFooter from "@/components/site-footer"
import SiteNavbar from "@/components/site-navbar"
import { getJobById } from "@/lib/api/jobs"
import {
  categoryStyle,
  deadlineInfo,
  formatDate,
  formatLocation,
  formatPosted,
  formatSalary,
  getJobStatus,
  type JobPost,
} from "@/lib/jobs"
import { cn } from "@/lib/utils"

interface JobDetailsPageProps {
  params: Promise<{ id: string }>
}

function toLines(text?: string): string[] {
  if (!text) return []
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function toBenefits(text?: string): string[] {
  if (!text) return []
  return text
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  let job: JobPost
  try {
    job = await getJobById(id)
  } catch (err) {
    console.error("Job details fetch error:", err)
    notFound()
  }

  if (!job) {
    notFound()
  }

  const { color } = categoryStyle(job.category)
  const status = getJobStatus(job)
  const deadline = deadlineInfo(job.deadline)
  const formattedSalary = formatSalary(job)
  const location = formatLocation(job, "Remote / Flexible")
  const posted = formatPosted(job.datePosted, true)

  const responsibilities = toLines(job.responsibilities)
  const requirements = toLines(job.requirements)
  const benefits = toBenefits(job.benefits)

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white">
      <SiteNavbar />

      <main className="mx-auto w-full max-w-6xl px-3 pt-24 pb-16 sm:px-6 lg:px-8">
        {/* Navigation / Back Button */}
        <div className="mb-4">
          <Link
            href="/browse-jobs"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/50 transition-colors hover:text-white sm:text-sm"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            <span>Back to Browse Jobs</span>
          </Link>
        </div>

        {/* Header Section matching Figma: Header Section */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#121214] p-4 shadow-sm sm:p-6 lg:p-8">
          {/* Subtle category accent gradient line */}
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Category/Logo + Titles */}
            <div className="flex min-w-0 items-start gap-4 sm:gap-5">
              <CategoryTile
                category={job.category}
                className="size-14 shrink-0 rounded-2xl sm:size-16"
                iconClassName="size-6 sm:size-7"
              />

              <div className="flex min-w-0 flex-col gap-2">
                <h1 className="text-xl font-bold tracking-tight break-words text-white sm:text-2xl md:text-3xl">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2.5 text-xs text-white/60 sm:text-sm">
                  <span className="font-semibold text-white">
                    {job.company || "HireLoop Partner"}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                    <ShieldCheck className="size-3.5" />
                    <span>Verified Employer</span>
                  </span>

                  <span className="text-white/20">•</span>

                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 text-white/40" />
                    <span>{location}</span>
                  </span>

                  {posted && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="inline-flex items-center gap-1 text-white/40">
                        <Clock className="size-3.5" />
                        <span>{posted}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Apply Button */}
            <div className="flex w-full shrink-0 sm:w-auto">
              <ApplyNowButton job={job} />
            </div>
          </div>
        </section>

        {/* Bento Info Grid matching Figma: Bento Info Grid */}
        <section className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {/* Card 1: SALARY RANGE */}
          <div className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-[#121214] p-4">
            <div className="flex items-center gap-2 text-white/50">
              <DollarSign className="size-4 text-[#c3c0ff]" />
              <span className="text-[10px] font-semibold tracking-wider uppercase sm:text-[11px]">
                Salary Range
              </span>
            </div>
            <p className="truncate text-sm font-semibold text-white sm:text-base">
              {formattedSalary !== "Not specified"
                ? formattedSalary
                : "Competitive"}
            </p>
          </div>

          {/* Card 2: LOCATION */}
          <div className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-[#121214] p-4">
            <div className="flex items-center gap-2 text-white/50">
              <MapPin className="size-4 text-emerald-400" />
              <span className="text-[10px] font-semibold tracking-wider uppercase sm:text-[11px]">
                Location
              </span>
            </div>
            <p className="truncate text-sm font-semibold text-white sm:text-base">
              {location}
            </p>
          </div>

          {/* Card 3: JOB TYPE */}
          <div className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-[#121214] p-4">
            <div className="flex items-center gap-2 text-white/50">
              <Briefcase className="size-4 text-sky-400" />
              <span className="text-[10px] font-semibold tracking-wider uppercase sm:text-[11px]">
                Job Type
              </span>
            </div>
            <p className="truncate text-sm font-semibold text-white sm:text-base">
              {job.type || "Full-time"}
            </p>
          </div>

          {/* Card 4: DEADLINE */}
          <div className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-[#121214] p-4">
            <div className="flex items-center gap-2 text-white/50">
              <CalendarClock className="size-4 text-amber-400" />
              <span className="text-[10px] font-semibold tracking-wider uppercase sm:text-[11px]">
                Deadline
              </span>
            </div>
            <p className="truncate text-sm font-semibold text-white sm:text-base">
              {job.deadline ? formatDate(job.deadline) : "Open until filled"}
            </p>
          </div>
        </section>

        {/* Main Content Area: Left Details + Right Sidebar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left Column: Content Sections matching Figma */}
          <section className="flex flex-col gap-8 rounded-2xl border border-white/10 bg-[#121214] p-5 shadow-sm sm:p-7">
            {/* 1. Job Description */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-white sm:text-lg">
                Job Description
              </h3>
              <p className="text-xs leading-relaxed text-white/70 sm:text-sm">
                At {job.company || "HireLoop Partner"}, we are seeking a
                passionate and driven{" "}
                <span className="font-semibold text-white">{job.title}</span> to
                join our <span className="text-[#c3c0ff]">{job.category}</span>{" "}
                team. In this role, you will collaborate with cross-functional
                team members to design, develop, and deliver high-impact
                solutions for our users and platform.
              </p>
            </div>

            {/* 2. Responsibilities */}
            {responsibilities.length > 0 && (
              <>
                <div className="h-px bg-white/10" />
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    Responsibilities
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {responsibilities.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-xs leading-relaxed text-white/70 sm:text-sm"
                      >
                        <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#5c53fe]/20 text-[#c3c0ff]">
                          <Check className="size-2.5" />
                        </span>
                        <span className="break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* 3. Requirements */}
            {requirements.length > 0 && (
              <>
                <div className="h-px bg-white/10" />
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    Requirements
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {requirements.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-xs leading-relaxed text-white/70 sm:text-sm"
                      >
                        <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#5c53fe]/20 text-[#c3c0ff]">
                          <Check className="size-2.5" />
                        </span>
                        <span className="break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* 4. Benefits */}
            {benefits.length > 0 && (
              <>
                <div className="h-px bg-white/10" />
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    Benefits &amp; Perks
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#5c53fe]/15 text-[#c3c0ff]">
                          <Gift className="size-4" />
                        </div>
                        <span className="text-xs font-medium break-words text-white sm:text-sm">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Right Column: Aside - Sidebar matching Figma */}
          <aside className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#121214] p-5 shadow-sm sm:p-6">
              <h3 className="text-base font-semibold text-white">
                Company Overview
              </h3>

              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60">
                  <Building2 className="size-5" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold text-white">
                    {job.company || "HireLoop Partner"}
                  </span>
                  <span className="text-xs text-white/50">{job.category}</span>
                </div>
              </div>

              {/* Company & Role Details */}
              <div className="flex flex-col gap-3.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] tracking-wider text-white/50 uppercase">
                    Industry
                  </span>
                  <span className="truncate text-right font-medium text-white">
                    {job.category || "Technology"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] tracking-wider text-white/50 uppercase">
                    Workplace
                  </span>
                  <span className="text-right font-medium text-white">
                    {job.remote ? "Remote" : "On-site / Hybrid"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] tracking-wider text-white/50 uppercase">
                    Status
                  </span>
                  <StatusBadge status={status} />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] tracking-wider text-white/50 uppercase">
                    Applicants
                  </span>
                  <span className="text-right font-medium text-white">
                    {job.applicants ?? 0} Candidates
                  </span>
                </div>

                {deadline.text && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] tracking-wider text-white/50 uppercase">
                      Closing
                    </span>
                    <span
                      className={cn(
                        "text-right font-medium",
                        deadline.className
                      )}
                    >
                      {deadline.text}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-2 flex flex-col gap-2.5 border-t border-white/10 pt-4">
                <ApplyNowButton job={job} />

                <Link
                  href="/browse-jobs"
                  className="flex h-10 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Browse more jobs
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
