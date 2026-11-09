// Shared job types + sample data for the recruiter job pages.
//
// `JobForm` itself lives next to the Post a Job form — it is imported here so
// the table can never drift from what the form actually collects.
import type { JobForm } from "@/app/dashboard/recruiter/jobs/new/page"

export type { JobForm }

export type JobStatus = "Active" | "Closed" | "Draft"

/** A saved job post: everything the form collects plus what the table shows. */
export type JobPost = JobForm & {
  id: string
  company: string
  status: JobStatus
  applicants: number
  /** ISO date the post went live, e.g. "2026-11-05" */
  datePosted: string
}

export const DUMMY_JOBS: JobPost[] = [
  {
    id: "job_1",
    company: "HirePulse Network",
    title: "Frontend Developer",
    category: "Engineering",
    type: "Full-time",
    salaryMin: "70000",
    salaryMax: "95000",
    currency: "EUR",
    city: "New York",
    country: "USA",
    remote: true,
    deadline: "2026-12-30",
    responsibilities: "Build and maintain product features",
    requirements: "3+ years of experience with React",
    benefits: "Health insurance, 13th month pay",
    status: "Active",
    applicants: 34,
    datePosted: "2026-11-05",
  },
  {
    id: "job_2",
    company: "HirePulse Labs",
    title: "Senior Product Designer",
    category: "Design",
    type: "Full-time",
    salaryMin: "90000",
    salaryMax: "115000",
    currency: "GBP",
    city: "London",
    country: "UK",
    remote: false,
    deadline: "2026-12-15",
    responsibilities: "Own the end-to-end product design process",
    requirements: "5+ years of product design experience",
    benefits: "Flexible hours, learning stipend",
    status: "Active",
    applicants: 19,
    datePosted: "2026-10-28",
  },
  {
    id: "job_3",
    company: "HirePulse Platform",
    title: "Platform Operations Lead",
    category: "Operations",
    type: "Contract",
    salaryMin: "85000",
    salaryMax: "105000",
    currency: "EUR",
    city: "Berlin",
    country: "Germany",
    remote: false,
    deadline: "2027-01-31",
    responsibilities: "Run day-to-day platform operations",
    requirements: "Experience with incident response",
    benefits: "Contract extension bonus",
    status: "Active",
    applicants: 12,
    datePosted: "2026-10-14",
  },
  {
    id: "job_4",
    company: "HirePulse Network",
    title: "Product Marketing Lead",
    category: "Marketing",
    type: "Full-time",
    salaryMin: "80000",
    salaryMax: "105000",
    currency: "EUR",
    city: "",
    country: "",
    remote: true,
    deadline: "2027-01-15",
    responsibilities: "Plan launches and product messaging",
    requirements: "5+ years in B2B product marketing",
    benefits: "Remote stipend, home office budget",
    status: "Active",
    applicants: 27,
    datePosted: "2026-11-04",
  },
  {
    id: "job_5",
    company: "HirePulse Platform",
    title: "QA Automation Engineer",
    category: "Engineering",
    type: "Part-time",
    salaryMin: "45000",
    salaryMax: "60000",
    currency: "EUR",
    city: "Dublin",
    country: "Ireland",
    remote: false,
    deadline: "2026-05-01",
    responsibilities: "Build and maintain the automated test suite",
    requirements: "Experience with Playwright or Cypress",
    benefits: "",
    status: "Closed",
    applicants: 8,
    datePosted: "2026-03-01",
  },
  {
    id: "job_6",
    company: "HirePulse Labs",
    title: "Sales Development Representative",
    category: "Sales",
    type: "Full-time",
    salaryMin: "600000",
    salaryMax: "900000",
    currency: "PHP",
    city: "Makati City",
    country: "Philippines",
    remote: false,
    deadline: "",
    responsibilities: "Qualify inbound leads and book demos",
    requirements: "Strong written communication",
    benefits: "Uncapped commission",
    status: "Draft",
    applicants: 0,
    datePosted: "2026-11-08",
  },
]
