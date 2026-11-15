import Link from "next/link"
import { ArrowUpRight, Briefcase, ClipboardList, Users } from "lucide-react"

import ApplicationStatusSummary from "@/app/dashboard/recruiter/_components/application-status-summary"
import { getApplicationsByJobId } from "@/lib/api/applications"
import { getJobs } from "@/lib/api/jobs"
import type { JobPost } from "@/lib/jobs"
import type { JobApplication } from "@/lib/types/applications"
import { getSession } from "@/lib/core/server"

export default async function RecruiterApplicationsPage() {
  const session = await getSession()

  const jobs: JobPost[] = session
    ? await getJobs(`userId=${session.user.id}`)
    : []

  const jobsWithApplications = await Promise.all(
    jobs.map(async (job) => ({
      job,
      applications: await getApplicationsByJobId(job._id),
    }))
  )

  const totalApplications = jobsWithApplications.reduce(
    (total, item) => total + item.applications.length,
    0
  )

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0d0d10] px-3 py-4 text-white sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-[#5b4fe9]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Header */}
        <header className="mb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5b4fe9]/30 bg-[#5b4fe9]/10 px-2.5 py-1 text-[9px] font-semibold tracking-widest text-[#a79cf8] uppercase">
            <span className="size-1.5 rounded-full bg-[#a79cf8]" />
            Recruiter Dashboard
          </span>

          <h1 className="mt-2.5 text-xl font-bold tracking-tight sm:text-2xl">
            Applications
          </h1>

          <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-white/50 sm:text-xs">
            Track applications across all your job postings and manage your
            candidates.
          </p>
        </header>

        {/* Overview */}
        <div className="mb-6 grid grid-cols-2 gap-2.5 sm:gap-3">
          <div className="rounded-xl border border-white/[0.07] bg-gradient-to-br from-[#18181d] to-[#121215] p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/50">
                Total Job Posts
              </span>
              <span className="flex size-7 items-center justify-center rounded-lg bg-white/[0.05] text-white/60">
                <Briefcase className="size-3.5" />
              </span>
            </div>

            <p className="mt-3 text-2xl leading-none font-bold tracking-tight sm:text-3xl">
              {jobs.length}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-[#5b4fe9]/30 bg-gradient-to-br from-[#5b4fe9]/20 to-[#5b4fe9]/5 p-3.5 sm:p-4">
            <div className="pointer-events-none absolute -top-10 -right-10 size-24 rounded-full bg-[#5b4fe9]/30 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#c4bdff]">
                Total Applications
              </span>
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#5b4fe9]/25 text-[#c4bdff]">
                <Users className="size-3.5" />
              </span>
            </div>

            <p className="relative mt-3 text-2xl leading-none font-bold tracking-tight sm:text-3xl">
              {totalApplications}
            </p>
          </div>
        </div>

        {/* Job Application List */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight sm:text-base">
              Your Job Applications
            </h2>

            <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/50">
              {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
            </span>
          </div>

          {jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-[#151518] px-4 py-12 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#5b4fe9]/10">
                <Briefcase className="size-6 text-[#a79cf8]" />
              </div>

              <h3 className="mt-3 text-sm font-semibold">No Job Posts Yet</h3>

              <p className="mx-auto mt-1 max-w-xs text-[11px] text-white/50">
                Your job applications will appear here after you post a job.
              </p>

              <Link
                href="/dashboard/recruiter/jobs/new"
                className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#5b4fe9] px-4 text-[11px] font-semibold text-white shadow-lg shadow-[#5b4fe9]/30 transition-colors hover:bg-[#6c61f0] active:scale-[0.98]"
              >
                Create a Job
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobsWithApplications.map(({ job, applications }) => (
                <article
                  key={job._id}
                  className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-br from-[#17171b] to-[#121214] p-3.5 shadow-lg shadow-black/20 transition-colors hover:border-white/[0.14] sm:p-4"
                >
                  <div className="pointer-events-none absolute -top-16 -right-16 size-36 rounded-full bg-[#5b4fe9]/10 blur-3xl transition-opacity group-hover:opacity-100 sm:opacity-70" />

                  <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <span className="inline-block rounded-md bg-[#5b4fe9]/10 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-[#a79cf8] uppercase">
                        {job.category}
                      </span>

                      <h3 className="mt-1.5 truncate text-sm font-semibold tracking-tight sm:text-base">
                        {job.title}
                      </h3>

                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-white/50 sm:text-[11px]">
                        <span>{job.company}</span>
                        <span className="size-1 rounded-full bg-white/20" />
                        <span>{job.type}</span>
                        <span className="size-1 rounded-full bg-white/20" />
                        <span>{job.remote ? "Remote" : "On-site"}</span>
                      </p>
                    </div>

                    <div className="flex w-fit shrink-0 items-center gap-2 rounded-lg border border-[#5b4fe9]/30 bg-[#5b4fe9]/10 px-2.5 py-1.5">
                      <ClipboardList className="size-3.5 text-[#a79cf8]" />

                      <span className="text-sm leading-none font-bold">
                        {applications.length}
                      </span>

                      <span className="text-[10px] text-[#c4bdff]/70">
                        {applications.length === 1 ? "Applicant" : "Applicants"}
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-3.5 border-t border-white/[0.06] pt-3">
                    <p className="mb-2.5 text-[9px] font-semibold tracking-widest text-white/40 uppercase">
                      Application Status
                    </p>

                    {applications.length > 0 ? (
                      <ApplicationStatusSummary
                        applications={applications as JobApplication[]}
                      />
                    ) : (
                      <p className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-3 py-4 text-center text-[11px] text-white/40">
                        No applications received for this job yet.
                      </p>
                    )}
                  </div>

                  <div className="relative mt-3 flex justify-end border-t border-white/[0.06] pt-3">
                    <Link
                      href={`/dashboard/recruiter/jobs/${job._id}/applications`}
                      className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-[11px] font-medium text-white/80 transition-all hover:border-[#5b4fe9]/50 hover:bg-[#5b4fe9]/15 hover:text-white active:scale-[0.98] sm:w-auto"
                    >
                      View Applicants
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
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
