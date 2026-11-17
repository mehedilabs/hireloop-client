import { getUsers } from "@/lib/api/user"
import { getSession } from "@/lib/core/server"

import UsersManager, { type AdminUser } from "./_components/users-manager"

const AdminUsersPage = async () => {
  const [result, session] = await Promise.all([getUsers(), getSession()])

  const users: AdminUser[] = result.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: user.role ?? "seeker",
    banned: Boolean(user.banned),
    createdAt: new Date(user.createdAt).toISOString(),
  }))

  return <UsersManager users={users} currentUserId={session?.user.id} />
}

export default AdminUsersPage
