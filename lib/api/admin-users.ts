import "server-only"

import { headers } from "next/headers"

import { auth } from "../auth"

export const getUsers = async () => {
  const users = await auth.api.listUsers({
    query: {
      sortBy: "name",
      sortDirection: "desc",
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  })
  return users
}