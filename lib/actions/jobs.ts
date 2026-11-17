
"use server"

import type { JobForm } from "@/lib/jobs"
import {
  authFetch,
  protectedMutation,
} from "../core/server"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const createJob = async (data: JobForm) => {
  const api = `${BASE_URL}/jobs`

  const res = await protectedMutation(api, "POST", data)

  if (!res.ok) {
    throw new Error("Failed to create job")
  }

  return res.json()
}

export const deleteJob = async (jobId: string) => {
  const api = `${BASE_URL}/jobs/${jobId}`

  const res = await protectedMutation(api, "DELETE")

  if (!res.ok) {
    throw new Error("Failed to delete job")
  }

  return res.json()
}

export const updateJob = async (
  jobId: string,
  data: JobForm
) => {
  const api = `${BASE_URL}/jobs/${jobId}`

  const res = await protectedMutation(api, "PUT", data)

  if (!res.ok) {
    throw new Error("Failed to update job")
  }

  return res.json()
}

export const getJobPostCount = async (
  _userId: string
) => {
  const res = await authFetch(
    `${BASE_URL}/jobs/count`
  )

  if (!res.ok) {
    throw new Error("Failed to fetch job post count")
  }

  return res.json()
}
