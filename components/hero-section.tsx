"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, MapPin, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import globe from "@/app/images/globe.png"

const TRENDING = ["Product Designer", "AI Engineering", "DevOps Engineer"]

export default function HeroSection() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (location) params.set("location", location)
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-black pb-4 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.14),transparent_65%)]" />

      <div className="relative mx-auto max-w-6xl px-4 pt-32 sm:px-6 sm:pt-40">
        {/* Badge */}
        <div className="flex items-center justify-center gap-3">
          <span className="hidden h-px w-16 bg-gradient-to-r from-transparent to-white/30 sm:block" />
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-[11px] tracking-wider text-white/70 uppercase">
            <Briefcase className="size-3.5 text-orange-400" />
            <span className="font-bold text-white">50,000+</span> new jobs this
            month
          </div>
          <span className="hidden h-px w-16 bg-gradient-to-l from-transparent to-white/30 sm:block" />
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-center text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Find Your Dream Job Today
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-white/60 sm:text-base">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-white/10 bg-[#0f0f10] p-2 sm:flex-row sm:items-center"
        >
          <label className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5">
            <Search className="size-4 shrink-0 text-white/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title, skill or company"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </label>

          <span className="hidden h-6 w-px bg-white/10 sm:block" />

          <label className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5">
            <MapPin className="size-4 shrink-0 text-white/50" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location or Remote"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </label>

          <Button
            type="submit"
            aria-label="Search jobs"
            className="h-10 rounded-xl bg-[#5b4fe9] text-white hover:bg-[#6c61f0] sm:w-10 sm:px-0"
          >
            <Search className="size-4" />
            <span className="sm:hidden">Search</span>
          </Button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-white/50">Trending Positions:</span>
          {TRENDING.map((item) => (
            <Link
              key={item}
              href={`/jobs?q=${encodeURIComponent(item)}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
