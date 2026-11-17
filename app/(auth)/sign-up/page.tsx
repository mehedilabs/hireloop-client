"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Search,
  User,
} from "lucide-react"

import AuthToggle from "@/components/auth-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

const inputClass =
  "h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/30 transition-colors focus-visible:border-[#7c6cf5] focus-visible:ring-[#7c6cf5]/30"

const ROLES = [
  {
    value: "seeker",
    label: "Job Seeker",
    desc: "Find your next job",
    icon: Search,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    desc: "Hire top talent",
    icon: Building2,
  },
] as const

const ALLOWED_ROLES = ROLES.map((r) => r.value) as string[]

const SignupPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const rawRole = formData.get("role") as string
    const role = ALLOWED_ROLES.includes(rawRole) ? rawRole : "seeker"

    setLoading(true)

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      role,
      callbackURL: "/",
    })

    setLoading(false)

    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.")
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 pt-28 pb-12 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#5b4fe9]/30 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0f0f10]/90 p-6 shadow-2xl shadow-[#5b4fe9]/10 backdrop-blur-xl sm:p-8">
        <AuthToggle />

        <div className="mt-8">
          <h1 className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Join thousands of job seekers on HireLoop.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {/* Role picker */}
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-medium text-white/80">
              I am a
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((r, i) => {
                const Icon = r.icon
                return (
                  <label key={r.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      defaultChecked={i === 0}
                      className="peer sr-only"
                    />
                    <span className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center text-white/50 transition-all peer-checked:border-[#5b4fe9] peer-checked:bg-[#5b4fe9]/15 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-[#5b4fe9]/20 peer-focus-visible:ring-2 peer-focus-visible:ring-[#7c6cf5] hover:border-white/25 hover:text-white">
                      <Icon className="size-5" />
                      <span className="mt-1 text-sm font-medium">
                        {r.label}
                      </span>
                      <span className="text-xs text-white/40">{r.desc}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/80">
              Full name
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">
              Email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">
              Password
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={8}
                required
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-white/40">At least 8 characters.</p>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-[#5b4fe9] to-[#7c6cf5] text-base font-medium text-white shadow-lg shadow-[#5b4fe9]/30 transition-all hover:from-[#6c61f0] hover:to-[#8d7ff7] disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-[#7c6cf5] transition-colors hover:text-[#968af8]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

export default SignupPage
