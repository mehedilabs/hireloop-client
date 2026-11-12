const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function applyToAJob(data) {
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