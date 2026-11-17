
"use server"

import { authFetch } from "@/lib/core/server"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const getUserPremiumById = async (userId: string) => {
  const response = await authFetch(
    `${BASE_URL}/users/${userId}/premium`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch premium status")
  }

  return response.json()
}

export const getRecruiterPremiumById = async (userId: string) => {
  const response = await authFetch(
    `${BASE_URL}/users/${userId}/premium`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch recruiter premium status")
  }

  const result = await response.json()

  return result?.recruiterPremium === true
}
