import type { JobApplication } from "@/lib/types/applications"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const getMyApplications = async (
  userId: string
): Promise<JobApplication[]> => {
  const res = await fetch(`${BASE_URL}/applications?userId=${userId}`)

  if (!res.ok) {
    throw new Error("Failed to fetch applications")
  }

  return res.json()
}