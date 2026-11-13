
import type { JobPost } from "@/lib/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export type SavedJob = {
  _id: string
  userId: string
  jobId: string
  savedAt: string
  job: JobPost
}

export const getMySavedJobs = async (
  userId: string
): Promise<SavedJob[]> => {
  const res = await fetch(`${BASE_URL}/saved-jobs?userId=${userId}`)

  if (!res.ok) {
    throw new Error("Failed to fetch saved jobs")
  }

  return res.json()
}
