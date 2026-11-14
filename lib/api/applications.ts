
import type { JobApplication } from "@/lib/types/applications"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const getMyApplications = async (
  applicantId: string
): Promise<JobApplication[]> => {
  const res = await fetch(
    `${BASE_URL}/applications?applicantId=${applicantId}`
  )

  if (!res.ok) {
    throw new Error("Failed to fetch applications")
  }

  return res.json()
}

export const getApplicationsCount = async (
  applicantId: string
): Promise<{ count: number }> => {
  const res = await fetch(
    `${BASE_URL}/applications/count?applicantId=${applicantId}`
  )

  if (!res.ok) {
    throw new Error("Failed to fetch applications count")
  }

  return res.json()
}
