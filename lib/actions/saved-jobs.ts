
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type SaveJobData = {
  userId: string
  jobId: string
}

export const saveJob = async (data: SaveJobData) => {
  const response = await fetch(`${BASE_URL}/saved-jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to save job")
  }

  return response.json()
}

export const removeSavedJob = async (savedJobId: string) => {
  const response = await fetch(`${BASE_URL}/saved-jobs/${savedJobId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to remove saved job")
  }

  return response.json()
}
