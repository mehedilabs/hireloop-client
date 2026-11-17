
"use server"

import { protectedMutation } from "../core/server"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type SaveJobData = {
  userId: string
  jobId: string
}

export const saveJob = async (data: SaveJobData) => {
  const response = await protectedMutation(
    `${BASE_URL}/saved-jobs`,
    "POST",
    data
  )

  if (!response.ok) {
    throw new Error("Failed to save job")
  }

  return response.json()
}

export const removeSavedJob = async (
  savedJobId: string
) => {
  const response = await protectedMutation(
    `${BASE_URL}/saved-jobs/${savedJobId}`,
    "DELETE"
  )

  if (!response.ok) {
    throw new Error("Failed to remove saved job")
  }

  return response.json()
}
