
"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export type UserRole = "admin" | "recruiter" | "seeker"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

async function assertAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }
}

export async function updateUserRole(userId: string, role: UserRole) {
  await assertAdmin()

  const res = await fetch(`${BASE_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  })

  if (!res.ok) {
    throw new Error("Failed to update user role")
  }

  return res.json()
}

export async function suspendUser(userId: string) {
  await assertAdmin()

  const res = await fetch(`${BASE_URL}/users/${userId}/ban`, {
    method: "PATCH",
  })

  if (!res.ok) {
    throw new Error("Failed to suspend user")
  }

  return res.json()
}

export async function activateUser(userId: string) {
  await assertAdmin()

  const res = await fetch(`${BASE_URL}/users/${userId}/unban`, {
    method: "PATCH",
  })

  if (!res.ok) {
    throw new Error("Failed to activate user")
  }

  return res.json()
}

export async function deleteUser(userId: string) {
  await assertAdmin()

  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete user")
  }

  return res.json()
}
