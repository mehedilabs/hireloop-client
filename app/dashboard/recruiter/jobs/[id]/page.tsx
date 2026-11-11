import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  Check,
  Gift,
  Laptop,
  ListChecks,
  MapPin,
  Tag,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { Chip } from "@/app/components/jobs/Chip"
import { CategoryTile } from "@/app/components/jobs/CategoryTile"
import { StatusBadge } from "@/app/components/jobs/StatusBadge"
import { EditJobDialog } from "@/app/components/EditJobDialog"
import { getJobById } from "@/lib/api/jobs"
import {
  categoryStyle,
  deadlineInfo,
  formatDate,
  formatLocation,
  formatPosted,
  formatSalary,
  type JobPost,
} from "@/lib/jobs"
import { cn } from "@/lib/utils"

type JobDetailsPageProps = {
  params: Promise<{ id: string }>
}

/* ---------- helpers ---------- */

function toLines(text: string) {
  return (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function toBenefits(text: string) {
  return (text ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

/* ---------- page ---------- */

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params

  let job: JobPost

  try {
    job = await getJobById(id)
  } catch {
    notFound()
  }

  const { color } = categoryStyle(job.category)

  const deadline = deadlineInfo(job.deadline)
  const responsibilities = toLines(job.responsibilities)
  const requirements = toLines(job.requirements)
  const benefits = toBenefits(job.benefits)

  const hasDescription =
    responsibilities.length > 0 ||
    requirements.length > 0 ||
    benefits.length > 0

  return (
    <main className="min-h-screen bg-[#131314] px-3 py-4 text-white sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Back link */}
        <Link
          href="/dashboard/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-xs text-[#8a8a95] transition-colors hover:text-white sm:text-[13px]"
        >
          <ArrowLeft className="size-3.5 sm:size-4" />
          Back to Manage Jobs
        </Link>

        {/* Header card */}
        <header className="relative mt-3 overflow-hidden rounded-xl border border-[#232327] bg-[#151516] shadow-xl shadow-black/20 sm:mt-4 sm:rounded-2xl">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />

          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <CategoryTile
                  category={job.category}
                  className="sm:size-12 sm:rounded-xl"
                  iconClassName="size-5 sm:size-6"
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium sm:px-2.5 sm:text-[11px]"
                      style={{ color, backgroundColor: `${color}1a` }}
                    >
                      {job.category}
                    </span>

                    <StatusBadge
                      status={job.status}
                      className="h-auto gap-1 px-2 py-0.5 sm:gap-1.5 sm:px-2.5 sm:text-[11px]"
                    />
                  </div>

                  <h1 className="mt-2 text-lg leading-tight font-semibold tracking-tight break-words sm:mt-2.5 sm:text-[26px]">
                    {job.title}
                  </h1>

                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#a0a0ab] sm:text-sm">
                    <Building2 className="size-3.5 shrink-0 sm:size-4" />
                    {job.company}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 md:shrink-0">
                <EditJobDialog
                  job={job}
                  showLabel
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#5c53fe] px-2.5 text-xs font-semibold text-white shadow-md shadow-[#5c53fe]/15 transition-all duration-200 hover:bg-[#7169ff] hover:shadow-lg hover:shadow-[#5c53fe]/20 sm:h-10 sm:flex-none sm:gap-2 sm:px-4 sm:text-[13px]"
                />

                <Link
                  href="/dashboard/recruiter/applications"
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#2a2a2f] bg-[#1c1c1f] px-2.5 text-xs font-medium text-[#d4d4d8] transition-colors hover:bg-[#25252a] hover:text-white sm:h-10 sm:flex-none sm:gap-2 sm:px-4 sm:text-[13px]"
                >
                  <Users className="size-3.5 sm:size-4" />
                  View Applicants
                </Link>
              </div>
            </div>

            {/* Quick chips */}
            <div className="mt-4 flex flex-wrap justify-center gap-1.5 border-t border-[#232327] pt-4 sm:mt-5 sm:gap-2 sm:pt-5 md:justify-start">
              <Chip icon={Briefcase}>{job.type}</Chip>
              <Chip icon={Laptop}>{job.remote ? "Remote" : "On-site"}</Chip>
              <Chip icon={MapPin}>{formatLocation(job, "Not specified")}</Chip>
            </div>
          </div>
        </header>

        {/* Key stats */}
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-3 lg:grid-cols-4">
          <StatCard icon={Wallet} label="Salary" value={formatSalary(job)} />

          <StatCard
            icon={Users}
            label="Applicants"
            value={`${job.applicants}`}
            sub={job.applicants === 1 ? "Candidate" : "Candidates"}
            subClassName="text-[#8a8a95]"
          />

          <StatCard
            icon={CalendarClock}
            label="Deadline"
            value={formatDate(job.deadline)}
            sub={deadline.text}
            subClassName={deadline.className}
          />

          <StatCard
            icon={CalendarDays}
            label="Posted"
            value={new Date(job.datePosted).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          />
        </div>

        {/* Content + sidebar */}
        <div className="mt-4 grid gap-4 lg:mt-5 lg:grid-cols-[1fr_280px] lg:items-start">
          {/* Description */}
          <div className="space-y-3">
            {responsibilities.length > 0 && (
              <Section icon={ListChecks} title="Responsibilities">
                <BulletList items={responsibilities} />
              </Section>
            )}

            {requirements.length > 0 && (
              <Section icon={Check} title="Requirements">
                <BulletList items={requirements} />
              </Section>
            )}

            {benefits.length > 0 && (
              <Section icon={Gift} title="Benefits">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {benefits.map((benefit) => (
                    <Chip key={benefit} className="font-normal sm:text-[13px]">
                      {benefit}
                    </Chip>
                  ))}
                </div>
              </Section>
            )}

            {!hasDescription && (
              <div className="rounded-xl border border-dashed border-[#2a2a2f] bg-[#151516] px-4 py-10 text-center text-xs text-[#5a5a60] sm:rounded-2xl sm:px-6 sm:py-14 sm:text-[13px]">
                No description has been added to this job yet.
              </div>
            )}
          </div>

          {/* Overview sidebar */}
          <aside className="rounded-xl border border-[#232327] bg-[#151516] p-4 sm:rounded-2xl sm:p-5 lg:sticky lg:top-6">
            <h2 className="text-sm font-semibold text-white sm:text-[15px]">
              Job overview
            </h2>

            <dl className="mt-3 grid grid-cols-2 gap-2.5 lg:mt-4 lg:grid-cols-1 lg:gap-0">
              <OverviewRow icon={Tag} label="Category" value={job.category} />
              <OverviewRow icon={Briefcase} label="Job type" value={job.type} />
              <OverviewRow
                icon={Laptop}
                label="Work mode"
                value={job.remote ? "Remote" : "On-site"}
              />
              <OverviewRow
                icon={MapPin}
                label="Location"
                value={formatLocation(job, "Not specified")}
              />
              <OverviewRow
                icon={Building2}
                label="Company"
                value={job.company}
                centered
              />
            </dl>
          </aside>
        </div>
      </div>
    </main>
  )
}

/* ---------- small components ---------- */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  subClassName,
}: {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  subClassName?: string
}) {
  return (
    <div className="min-w-0 rounded-xl border border-[#232327] bg-[#151516] p-3 sm:p-4">
      <div className="flex items-center gap-1.5 text-[#8a8a95] sm:gap-2">
        <Icon className="size-3.5 shrink-0 sm:size-4" />
        <span className="text-[10px] font-semibold tracking-wide uppercase sm:text-[11px]">
          {label}
        </span>
      </div>

      <p className="mt-2 text-[13px] leading-snug font-semibold break-words text-white sm:mt-2.5 sm:text-[17px]">
        {value}
      </p>

      {sub ? (
        <p
          className={cn(
            "mt-1 text-[10px] leading-snug sm:text-xs",
            subClassName
          )}
        >
          {sub}
        </p>
      ) : null}
    </div>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-[#232327] bg-[#151516] p-4 sm:rounded-2xl sm:p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-white sm:gap-2.5 sm:text-[15px]">
        <span className="flex size-7 items-center justify-center rounded-lg bg-[#5b4fe9]/15 text-[#a79cf8] ring-1 ring-[#5b4fe9]/25 sm:size-8">
          <Icon className="size-3.5 sm:size-4" />
        </span>
        {title}
      </h2>

      <div className="mt-3 sm:mt-4">{children}</div>
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 sm:space-y-3">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex gap-2.5 text-[13px] leading-relaxed text-[#c8c8d0] sm:gap-3 sm:text-sm"
        >
          <Check className="mt-1 size-3.5 shrink-0 text-[#a79cf8] sm:size-4" />
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function OverviewRow({
  icon: Icon,
  label,
  value,
  centered = false,
}: {
  icon: LucideIcon
  label: string
  value: string
  centered?: boolean
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-lg bg-white/[0.025] p-2.5 lg:rounded-none lg:border-b lg:border-[#232327] lg:bg-transparent lg:px-0 lg:py-3 lg:first:pt-0 lg:last:border-0 lg:last:pb-0",
        centered && "col-span-2 mx-auto w-1/2 lg:col-span-1 lg:mx-0 lg:w-full"
      )}
    >
      <div className="flex items-center gap-1.5 sm:gap-2 lg:items-start lg:gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-[#8a8a95] sm:size-8 sm:rounded-lg lg:mt-0.5">
          <Icon className="size-3.5 sm:size-4" />
        </span>

        <div className="min-w-0">
          <dt className="text-[9px] font-semibold tracking-wide text-[#777780] uppercase sm:text-[11px]">
            {label}
          </dt>

          <dd className="mt-1 text-[11px] leading-snug font-medium break-words text-[#e4e4e7] sm:text-[13px]">
            {value}
          </dd>
        </div>
      </div>
    </div>
  )
}
