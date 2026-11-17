
"use server"

import type { ApplicationStatus } from "@/lib/types/applications"
import { protectedMutation } from "../core/server"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type ApplyJobData = {
  jobId: string
  userId: string
  email: string
  jobTitle: string
  companyName: string
}

export const applyToAJob = async (data: ApplyJobData) => {
  const api = `${BASE_URL}/applications`

  const res = await protectedMutation(api, "POST", data)

  if (!res.ok) {
    throw new Error("Failed to apply for job")
  }

  return res.json()
}

export const updateApplicationArchive = async (
  applicationId: string,
  isArchived: boolean
) => {
  const api = `${BASE_URL}/applications/${applicationId}/archive`

  const response = await protectedMutation(
    api,
    "PATCH",
    { isArchived }
  )

  if (!response.ok) {
    throw new Error("Failed to update application archive status")
  }

  return response.json()
}

export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus
) => {
  const api = `${BASE_URL}/applications/${applicationId}`

  const response = await protectedMutation(
    api,
    "PATCH",
    { status }
  )

  if (!response.ok) {
    throw new Error("Failed to update application status")
  }

  return response.json()
}
