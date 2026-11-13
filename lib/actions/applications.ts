const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type ApplyJobData = {
  jobId: string
  userId: string
  email: string
  jobTitle: string
  companyName: string
}

export async function applyToAJob(data: ApplyJobData) {
  const response = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to submit application")
  }

  return response.json()
}



export const updateApplicationArchive = async (
  applicationId: string,
  isArchived: boolean
) => {
  const response = await fetch(
    `${BASE_URL}/applications/${applicationId}/archive`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isArchived }),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update application archive status")
  }

  return response.json()
}