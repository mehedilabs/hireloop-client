import { Suspense } from "react"

import SiteFooter from "@/components/site-footer"
import SiteNavbar from "@/components/site-navbar"
import { getJobs } from "@/lib/api/jobs"
import { type JobPost } from "@/lib/jobs"
import { BrowseJobsLayout } from "./_components/BrowseJobsLayout"
import { ApplicationSuccessToast } from "./_components/ApplicationSuccessToast"

const BrowseJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const search = await searchParams
  const urlsearch = new URLSearchParams(search as Record<string, string>)
  const query = urlsearch.toString()

  let jobs: JobPost[] = []
  try {
    const res = await getJobs(query)
    jobs = Array.isArray(res) ? res : res?.jobs || []
  } catch (error) {
    console.error("BrowseJobsPage getJobs error:", error)
    jobs = []
  }

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white">
      <SiteNavbar />
      <main className="mx-auto w-full max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <ApplicationSuccessToast />
          <BrowseJobsLayout initialJobs={jobs} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}

export default BrowseJobsPage
