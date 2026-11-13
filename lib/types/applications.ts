export type ApplicationStatus =
  | "Applied"
  | "Review"
  | "Shortlisted"
  | "Rejected"
  | "Offered"

export type JobApplication = {
  _id?: string
  jobId: string
  userId: string
  email: string
  jobTitle: string
  companyName: string
  category: string
  jobType: string
  remote: boolean
  appliedAt: string
  status: ApplicationStatus
}