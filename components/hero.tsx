import Link from "next/link"
import Image from "next/image"
import { Search, Sparkles } from "lucide-react"

import globe from "@/app/images/globe.png"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const STATS = [
  { value: "12,480+", label: "Active Jobs" },
  { value: "4,200+", label: "Companies" },
  { value: "85,000+", label: "Job Seekers" },
  { value: "98%", label: "Satisfaction Rate" },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#1e1e1f] text-white">
      {/* Aurora glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(80%_65%_at_50%_-12%,rgba(124,108,245,0.35),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_35%_at_18%_8%,rgba(236,72,153,0.14),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_82%_10%,rgba(56,88,255,0.16),transparent_70%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[13px] font-medium text-white/80">
            <Sparkles className="size-3.5 text-[#968af8]" />
            AI-powered job matching
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance uppercase sm:text-5xl lg:text-6xl">
            Find your next{" "}
            <span className="bg-gradient-to-r from-[#968af8] via-[#7c6cf5] to-[#5b4fe9] bg-clip-text text-transparent">
              dream job
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-base text-white/60 sm:text-lg">
            HireLoop connects you with thousands of verified companies hiring
            right now. Search smart, apply in one click, and track every
            application — all in one place.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/jobs"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-xl bg-[#5b4fe9] px-8 text-[15px] font-medium text-white hover:bg-[#6c61f0]"
              )}
            >
              <Search />
              Search Jobs
            </Link>
            <Link
              href="/get-started"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-xl border-white/15 bg-transparent px-8 text-[15px] font-medium text-[#7c6cf5] hover:bg-white/5 hover:text-[#968af8]"
              )}
            >
              Post a Job
            </Link>
          </div>
        </div>

        {/* Live stats */}
        <div className="mx-auto mt-16 grid w-full max-w-4xl grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-[13px] font-medium text-white/45">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Globe */}
        <div className="relative mx-auto mt-16 w-full max-w-4xl">
          <div
            aria-hidden="true"
            className="absolute inset-x-16 top-12 bottom-0 rounded-full bg-[#5b4fe9]/20 blur-3xl"
          />
          <Image
            src={globe}
            alt=""
            aria-hidden="true"
            priority
            className="relative w-full [mask-image:radial-gradient(60%_55%_at_50%_65%,black_50%,transparent_95%)]"
          />
        </div>
      </div>
    </section>
  )
}
