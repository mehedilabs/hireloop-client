import SiteFooter from "@/components/site-footer"
import SiteNavbar from "@/components/site-navbar"
import { getJobs } from "@/lib/api/jobs"
import { type JobPost } from "@/lib/jobs"
import { BrowseJobsLayout } from "./_components/BrowseJobsLayout"

// Fallback preview jobs matching the Figma design if the backend is not running
const FIGMA_SAMPLE_JOBS: JobPost[] = [
  {
    _id: "figma-job-1",
    title: "Senior Product Designer",
    company: "TechFlow Systems",
    category: "Design",
    type: "Full-time",
    city: "San Francisco",
    country: "CA",
    remote: true,
    salaryMin: "140000",
    salaryMax: "180000",
    currency: "USD",
    salaryFrequency: "per year",
    deadline: "2026-12-31",
    responsibilities: "",
    requirements: "",
    benefits: "",
    status: "Active",
    applicants: 42,
    datePosted: "2026-11-01",
  },
  {
    _id: "figma-job-2",
    title: "Lead Frontend Engineer",
    company: "FinGrid Solutions",
    category: "Engineering",
    type: "Full-time",
    city: "New York",
    country: "NY",
    remote: false,
    salaryMin: "165000",
    salaryMax: "210000",
    currency: "USD",
    salaryFrequency: "per year",
    deadline: "2026-12-15",
    responsibilities: "",
    requirements: "",
    benefits: "",
    status: "Active",
    applicants: 19,
    datePosted: "2026-11-04",
  },
  {
    _id: "figma-job-3",
    title: "UX Researcher",
    company: "CreativeStudio",
    category: "Design",
    type: "Contract",
    city: "Austin",
    country: "TX",
    remote: false,
    salaryMin: "110000",
    salaryMax: "145000",
    currency: "USD",
    salaryFrequency: "per year",
    deadline: "2026-12-20",
    responsibilities: "",
    requirements: "",
    benefits: "",
    status: "Active",
    applicants: 8,
    datePosted: "2026-11-05",
  },
  {
    _id: "figma-job-4",
    title: "Machine Learning Engineer",
    company: "HealthAI Corp",
    category: "Engineering",
    type: "Full-time",
    city: "Boston",
    country: "MA",
    remote: true,
    salaryMin: "180000",
    salaryMax: "250000",
    currency: "USD",
    salaryFrequency: "per year",
    deadline: "2026-12-25",
    responsibilities: "",
    requirements: "",
    benefits: "",
    status: "Active",
    applicants: 63,
    datePosted: "2026-11-08",
  },
]

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
    jobs = Array.isArray(res) ? res : (res?.jobs || [])
  } catch (error) {
    console.error("BrowseJobsPage getJobs error:", error)
    jobs = []
  }

  // Display retrieved jobs or Figma sample jobs as a fallback
  const displayJobs = jobs.length > 0 ? jobs : FIGMA_SAMPLE_JOBS

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white">
      <SiteNavbar />
      <main className="mx-auto w-full max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <BrowseJobsLayout initialJobs={displayJobs} />
      </main>
      <SiteFooter />
    </div>
  )
}

export default BrowseJobsPage
