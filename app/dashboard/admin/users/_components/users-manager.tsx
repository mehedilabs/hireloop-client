"use client"

import * as React from "react"
import {
  Briefcase,
  ChevronDown,
  Download,
  Loader2,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from "lucide-react"

import { toast } from "@/components/ui/toast"
import {
  activateUser,
  deleteUser,
  suspendUser,
  updateUserRole,
  type UserRole,
} from "@/lib/actions/users"

export type AdminUser = {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  banned: boolean
  createdAt: string
}

const ROLES: {
  value: UserRole
  label: string
  icon: React.ElementType
  active: string
}[] = [
  {
    value: "admin",
    label: "Admin",
    icon: ShieldCheck,
    active: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  },
  {
    value: "recruiter",
    label: "Recruiter",
    icon: Briefcase,
    active: "bg-[#5b4fe9]/20 text-[#b9b2ff] ring-[#5b4fe9]/40",
  },
  {
    value: "seeker",
    label: "Seeker",
    icon: UserRound,
    active: "bg-white/10 text-white ring-white/20",
  },
]

const normalizeRole = (role: string): UserRole =>
  role === "admin" || role === "recruiter" ? role : "seeker"

const AVATAR_GRADIENTS = [
  "from-[#5b4fe9] to-[#8b7cff]",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-400",
  "from-fuchsia-500 to-purple-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
]

const avatarGradient = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) % AVATAR_GRADIENTS.length
  }
  return AVATAR_GRADIENTS[hash]
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

const GRID =
  "lg:grid lg:grid-cols-[minmax(0,2fr)_auto_96px_104px_150px] lg:items-center lg:gap-4"

function Avatar({ user }: { user: AdminUser }) {
  if (user.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={user.image}
        alt={user.name}
        className="size-9 shrink-0 rounded-full object-cover ring-1 ring-white/10"
      />
    )
  }

  return (
    <div
      className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ${avatarGradient(user.email)}`}
    >
      {user.name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function UsersManager({
  users: initialUsers,
  currentUserId,
}: {
  users: AdminUser[]
  currentUserId?: string
}) {
  const [users, setUsers] = React.useState(initialUsers)
  const [query, setQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<"all" | UserRole>("all")
  const [pendingId, setPendingId] = React.useState<string | null>(null)
  const [now] = React.useState(() => Date.now())

  const patchUser = (id: string, patch: Partial<AdminUser>) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))

  const run = async (
    id: string,
    action: () => Promise<unknown>,
    onSuccess: () => void,
    message: string
  ) => {
    try {
      setPendingId(id)
      await action()
      onSuccess()
      toast.add({ title: "Updated", description: message })
    } catch (error) {
      console.error(error)
      toast.add({
        title: "Action Failed",
        description: "Could not complete this action.",
        type: "error",
      })
    } finally {
      setPendingId(null)
    }
  }

  const handleRole = (user: AdminUser, role: UserRole) => {
    if (normalizeRole(user.role) === role) return
    run(
      user.id,
      () => updateUserRole(user.id, role),
      () => patchUser(user.id, { role }),
      `${user.name} is now a ${role}.`
    )
  }

  const handleBan = (user: AdminUser) => {
    if (user.banned) {
      run(
        user.id,
        () => activateUser(user.id),
        () => patchUser(user.id, { banned: false }),
        `${user.name} has been activated.`
      )
    } else {
      run(
        user.id,
        () => suspendUser(user.id),
        () => patchUser(user.id, { banned: true }),
        `${user.name} has been suspended.`
      )
    }
  }

  const handleDelete = (user: AdminUser) => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return
    run(
      user.id,
      () => deleteUser(user.id),
      () => setUsers((prev) => prev.filter((u) => u.id !== user.id)),
      `${user.name} has been deleted.`
    )
  }

  const filtered = users.filter((user) => {
    const matchesRole =
      roleFilter === "all" || normalizeRole(user.role) === roleFilter
    const q = query.trim().toLowerCase()
    const matchesQuery =
      !q ||
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    return matchesRole && matchesQuery
  })

  const dayAgo = now - 24 * 60 * 60 * 1000
  const stats = [
    {
      label: "Total Users",
      value: users.length,
      hint: `${users.filter((u) => !u.banned).length} active`,
      hintClass: "text-emerald-400",
    },
    {
      label: "Recruiters",
      value: users.filter((u) => normalizeRole(u.role) === "recruiter").length,
      hint: "Hiring accounts",
      hintClass: "text-[#a79cf8]",
    },
    {
      label: "Suspended",
      value: users.filter((u) => u.banned).length,
      hint: users.length
        ? `${((users.filter((u) => u.banned).length / users.length) * 100).toFixed(1)}% of total`
        : "0% of total",
      hintClass: "text-red-400",
    },
    {
      label: "New Signups (24h)",
      value: users.filter((u) => new Date(u.createdAt).getTime() > dayAgo)
        .length,
      hint: "Last 24 hours",
      hintClass: "text-amber-400",
    },
  ]

  const exportCsv = () => {
    toast.add({
      title: "Coming Soon!",
      description: "CSV export functionality will be available soon.",
      type: "info",
    })
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0d0d10] px-3 py-5 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-[#5b4fe9]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5b4fe9]/30 bg-[#5b4fe9]/10 px-2.5 py-0.5 text-[9px] font-semibold tracking-widest text-[#a79cf8] uppercase">
              <span className="size-1 rounded-full bg-[#a79cf8]" />
              Admin Dashboard
            </span>
            <h1 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              User Management
            </h1>
            <p className="mt-1 text-[11px] text-white/50 sm:text-xs">
              Review, filter, and manage platform access for all users.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as "all" | UserRole)
                }
                className="h-9 cursor-pointer appearance-none rounded-lg border border-white/10 bg-[#141417] pr-8 pl-3 text-xs font-medium text-white outline-none hover:border-white/20 focus:border-[#5b4fe9]"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="recruiter">Recruiters</option>
                <option value="seeker">Seekers</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-white/50" />
            </div>

            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3.5 text-xs font-semibold text-black transition-colors hover:bg-white/90 active:scale-[0.98]"
            >
              <Download className="size-3.5" />
              Export List
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.07] bg-gradient-to-br from-[#17171b] to-[#121214] p-3.5 sm:p-4"
            >
              <p className="text-[11px] text-white/50">{stat.label}</p>
              <p className="mt-1.5 text-2xl leading-none font-bold tracking-tight">
                {stat.value.toLocaleString()}
              </p>
              <p className={`mt-2 text-[11px] ${stat.hintClass}`}>
                {stat.hint}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mt-5">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="h-10 w-full rounded-lg border border-white/10 bg-[#141417] pr-3 pl-9 text-xs text-white outline-none placeholder:text-white/30 focus:border-[#5b4fe9]"
          />
        </div>

        {/* Table */}
        <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.07] bg-[#121215]">
          <div
            className={`hidden border-b border-white/[0.07] bg-white/[0.02] px-4 py-2.5 text-[10px] font-semibold tracking-wider text-white/40 uppercase ${GRID}`}
          >
            <span>User</span>
            <span>Role</span>
            <span>Joined</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="px-4 py-14 text-center">
              <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-[#5b4fe9]/10">
                <Users className="size-5 text-[#a79cf8]" />
              </div>
              <p className="mt-3 text-sm font-semibold">No users found</p>
              <p className="mt-1 text-xs text-white/50">
                Try a different search or role filter.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {filtered.map((user) => {
                const role = normalizeRole(user.role)
                const isSelf = user.id === currentUserId
                const isPending = pendingId === user.id

                return (
                  <li
                    key={user.id}
                    className={`flex flex-col gap-3 px-3.5 py-3.5 transition-colors hover:bg-white/[0.02] sm:px-4 ${GRID} ${
                      user.banned ? "opacity-70" : ""
                    }`}
                  >
                    {/* User */}
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar user={user} />
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 truncate text-[13px] font-medium">
                          {user.name}
                          {isSelf && (
                            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-white/60">
                              You
                            </span>
                          )}
                        </p>
                        <p className="truncate text-[11px] text-white/45">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Role toggle */}
                    <div className="inline-flex w-full rounded-lg border border-white/[0.07] bg-[#0d0d10] p-0.5 lg:w-auto">
                      {ROLES.map(({ value, label, icon: Icon, active }) => {
                        const isActive = role === value
                        return (
                          <button
                            key={value}
                            type="button"
                            disabled={isSelf || isPending}
                            onClick={() => handleRole(user, value)}
                            aria-pressed={isActive}
                            className={`inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-md px-2.5 text-[11px] font-medium transition-all disabled:cursor-not-allowed lg:flex-none ${
                              isActive
                                ? `${active} ring-1`
                                : "text-white/45 hover:text-white disabled:hover:text-white/45"
                            }`}
                          >
                            <Icon className="size-3" />
                            {label}
                          </button>
                        )
                      })}
                    </div>

                    {/* Joined */}
                    <p className="hidden text-[11px] text-white/50 lg:block">
                      {formatDate(user.createdAt)}
                    </p>

                    {/* Status + mobile joined */}
                    <div className="flex items-center justify-between lg:block">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                          user.banned
                            ? "border-red-500/20 bg-red-500/10 text-red-400"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            user.banned ? "bg-red-400" : "bg-emerald-400"
                          }`}
                        />
                        {user.banned ? "Suspended" : "Active"}
                      </span>
                      <span className="text-[11px] text-white/40 lg:hidden">
                        Joined {formatDate(user.createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:justify-end">
                      {isPending && (
                        <Loader2 className="size-3.5 animate-spin text-[#a79cf8]" />
                      )}
                      <button
                        type="button"
                        disabled={isSelf || isPending}
                        onClick={() => handleBan(user)}
                        className={`h-7 flex-1 rounded-md border px-3 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 lg:flex-none ${
                          user.banned
                            ? "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                            : "border-red-500/20 text-red-400 hover:bg-red-500/10"
                        }`}
                      >
                        {user.banned ? "Activate" : "Suspend"}
                      </button>
                      <button
                        type="button"
                        disabled={isSelf || isPending}
                        onClick={() => handleDelete(user)}
                        aria-label={`Delete ${user.name}`}
                        className="flex size-7 shrink-0 items-center justify-center rounded-md border border-white/10 text-white/50 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <p className="mt-3 text-[11px] text-white/35">
          Showing {filtered.length} of {users.length} users
        </p>
      </div>
    </main>
  )
}
