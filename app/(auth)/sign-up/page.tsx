"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"

import AuthToggle from "@/components/auth-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

const inputClass =
  "h-11 border-white/10 bg-white/5 text-white placeholder:text-white/40"

const SignupPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    setLoading(true)

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/",
    })

    setLoading(false)

    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 pt-28 pb-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f0f10] p-6 sm:p-8">
        <AuthToggle />

        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Join thousands of job seekers on HireLoop.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/80">
              Full name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="your name"
              autoComplete="name"
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">
              Email
            </Label>
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={8}
              required
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-[#5b4fe9] text-white hover:bg-[#6c61f0]"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-[#7c6cf5] hover:text-[#968af8]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

export default SignupPage