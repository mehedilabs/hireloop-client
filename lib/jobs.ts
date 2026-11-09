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


