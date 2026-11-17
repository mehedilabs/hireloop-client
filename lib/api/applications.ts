
"use server"

import type { JobApplication } from "@/lib/types/applications"
import { authFetch } from "@/lib/core/server"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const getMyApplications = async (
  _applicantId: string
): Promise<JobApplication[]> => {
  const res = await authFetch(`${BASE_URL}/applications`)

  if (!res.ok) {
    throw new Error("Failed to fetch applications")
  }

  return res.json()
}

export const getApplicationsCount = async (
  _applicantId: string
): Promise<{ count: number }> => {
  const res = await authFetch(
    `${BASE_URL}/applications/count`
  )

  if (!res.ok) {
    throw new Error("Failed to fetch applications count")
  }

  return res.json()
}

export const getApplicationsByJobId = async (
  jobId: string
): Promise<JobApplication[]> => {
  const res = await authFetch(
    `${BASE_URL}/applications?jobId=${encodeURIComponent(jobId)}`
  )

  if (!res.ok) {
    throw new Error("Failed to fetch job applications")
  }

  return res.json()
}
