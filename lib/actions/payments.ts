
"use server"

import { protectedMutation } from "../core/server"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const checkoutVerify = async (sessionId: string) => {
  const response = await protectedMutation(
    `${BASE_URL}/payments/checkout-verify`,
    "POST",
    { sessionId }
  )

  if (!response.ok) {
    throw new Error("Payment verification failed")
  }

  return response.json()
}
