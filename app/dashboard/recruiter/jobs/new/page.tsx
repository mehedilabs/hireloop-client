"use client"

import * as React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Globe,
  MapPin,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createJob } from "@/lib/actions/jobs"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import {
  CURRENCY_SYMBOLS,
  JOB_CATEGORIES,
  JOB_TYPES,
  initialForm,
  type JobForm,
} from "@/lib/jobs"
import { selectContentClasses } from "@/app/components/form/styles"

// The single JobForm definition lives in @/lib/jobs; re-export it here so
// existing imports from this page keep working.
export type { JobForm }

// Figma shows 4 job types (no "Remote" - that is the toggle below)
const PAGE_JOB_TYPES = JOB_TYPES.filter((type) => type !== "Remote")

const SALARY_FREQUENCIES = [
  "per hour",
  "per day",
  "per week",
  "per month",
  "per year",
]

// Field look taken from the Figma frame
const fieldClasses =
  "h-10 w-full rounded-lg border border-white/5 bg-[#1a1a1f] px-3 text-[13px] text-[#ededef] placeholder:text-[#6b6b76] focus-visible:border-[#5b4fe9] focus-visible:ring-0"

function SectionHeading({ index, title }: { index: number; title: string }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-[12px] font-semibold text-[#ededef]">
      <span className="size-1.5 rounded-full bg-[#5b4fe9]" />
      {index}. {title}
    </h2>
  )
}

function Field({
  label,
  htmlFor,
  required,
  right,
  className,
  children,
}: {
  label: string
  htmlFor?: string
  required?: boolean
  right?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-medium text-[#c4c4cc]"
        >
          {label}
          {required ? <span className="ml-0.5 text-[#7c6cff]">*</span> : null}
        </label>
        {right}
      </div>
      {children}
    </div>
  )
}

export default function NewJobPage() {
  const router = useRouter()
  const [form, setForm] = React.useState<JobForm>(initialForm)
  const [location, setLocation] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  // text fields share one handler: <Input name="title" onChange={onChange} />
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // selects + checkbox set their value directly
  const update = <K extends keyof JobForm>(name: K, value: JobForm[K]) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const currencySymbol = CURRENCY_SYMBOLS[form.currency] ?? form.currency

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // single "Job Location" input -> city + country ("New York, USA")
    const [city, ...rest] = location.split(",")

    const result = await createJob({
      ...form,
      city: city.trim(),
      country: rest.join(",").trim(),
    })

    if (result?.acknowledged) {
      setSubmitted(true)

      toast.add({
        title: "Job Posted",
        description: "Your job has been posted successfully.",
      })

      router.push("/dashboard/recruiter/jobs")
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1 text-[10px] text-[#8a8a95]">
        <Link
          href="/dashboard/recruiter/jobs"
          className="transition-colors hover:text-[#ededef]"
        >
          Manage Jobs
        </Link>
        <ChevronRight className="size-3" />
        <Link
          href="/dashboard/recruiter/jobs"
          className="transition-colors hover:text-[#ededef]"
        >
          Job Listings &amp; Postings
        </Link>
        <ChevronRight className="size-3" />
        <span className="font-medium text-[#ededef]">Create Job Post</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#ededef] sm:text-3xl">
          Create Job Post
        </h1>
        <p className="mt-1.5 text-[11px] text-[#8a8a95]">
          Specify position details, compensation range, and candidate
          requirements for this listing.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* 1. Basic Information */}
        <section>
          <SectionHeading index={1} title="Basic Information" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Job Title"
              htmlFor="title"
              required
              className="sm:col-span-2"
            >
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="e.g. Frontend Developer"
                required
                className={fieldClasses}
              />
            </Field>

            <Field label="Company Name" htmlFor="company" required>
              <div className="relative">
                <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8a8a95]" />
                <Input
                  id="company"
                  name="company"
                  value={form.company}
                  onChange={onChange}
                  placeholder="e.g. HirePulse Network"
                  required
                  className={cn(fieldClasses, "pl-9")}
                />
              </div>
            </Field>

            <Field label="Job Category" required>
              <Select
                value={form.category}
                onValueChange={(value) => update("category", value ?? "")}
              >
                <SelectTrigger className={cn(fieldClasses, "justify-between")}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className={selectContentClasses}>
                  {JOB_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Job Type" required className="sm:col-span-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PAGE_JOB_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => update("type", type)}
                    className={cn(
                      "h-10 rounded-lg border text-[12px] font-medium transition-colors",
                      form.type === type
                        ? "border-[#5b4fe9] bg-[#5b4fe9]/10 text-white"
                        : "border-white/5 bg-[#1a1a1f] text-[#8a8a95] hover:border-white/15 hover:text-[#ededef]"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </section>

        {/* 2. Location, Compensation & Timeline */}
        <section>
          <SectionHeading index={2} title="Location, Compensation & Timeline" />
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Remote toggle */}
            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-[#1a1a1f] px-3 py-3 sm:col-span-2">
              <div className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/5">
                  <Globe className="size-3.5 text-[#c4c4cc]" />
                </span>
                <div>
                  <p className="text-[12px] font-medium text-[#ededef]">
                    Remote Work Allowed (isRemote)
                  </p>
                  <p className="text-[10px] text-[#8a8a95]">
                    Enable worldwide or distributed candidate applications
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={form.remote}
                aria-label="Remote work allowed"
                onClick={() => update("remote", !form.remote)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  form.remote ? "bg-[#5b4fe9]" : "bg-white/15"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform",
                    form.remote && "translate-x-5"
                  )}
                />
              </button>
            </div>

            <Field
              label="Job Location (location)"
              htmlFor="location"
              right={
                <span className="text-[10px] text-[#6b6b76]">Required</span>
              }
            >
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8a8a95]" />
                <Input
                  id="location"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New York, USA"
                  required
                  className={cn(fieldClasses, "pl-9")}
                />
              </div>
            </Field>

            <Field label="Application Deadline (deadline)" htmlFor="deadline">
              <div className="relative">
                <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8a8a95]" />
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={onChange}
                  className={cn(fieldClasses, "pl-9 [color-scheme:dark]")}
                />
              </div>
            </Field>

            {/* Salary row */}
            <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-3">
              <Field label="Min Salary / Rate" htmlFor="salaryMin">
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-[#8a8a95]">
                    {currencySymbol}
                  </span>
                  <Input
                    id="salaryMin"
                    name="salaryMin"
                    type="number"
                    min={0}
                    value={form.salaryMin}
                    onChange={onChange}
                    placeholder="25"
                    className={cn(fieldClasses, "pl-8")}
                  />
                </div>
              </Field>

              <Field label="Max Salary / Rate" htmlFor="salaryMax">
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-[#8a8a95]">
                    {currencySymbol}
                  </span>
                  <Input
                    id="salaryMax"
                    name="salaryMax"
                    type="number"
                    min={0}
                    value={form.salaryMax}
                    onChange={onChange}
                    placeholder="40"
                    className={cn(fieldClasses, "pl-8")}
                  />
                </div>
              </Field>

              <Field label="Frequency">
                <Select
                  value={form.salaryFrequency}
                  onValueChange={(value) =>
                    update("salaryFrequency", value ?? "")
                  }
                >
                  <SelectTrigger
                    className={cn(fieldClasses, "justify-between")}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClasses}>
                    {SALARY_FREQUENCIES.map((frequency) => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        </section>

        {/* 3. Responsibilities & Requirements */}
        <section>
          <SectionHeading index={3} title="Responsibilities & Requirements" />
          <div className="space-y-4">
            <Field
              label="Key Responsibilities"
              htmlFor="responsibilities"
              required
            >
              <Textarea
                id="responsibilities"
                name="responsibilities"
                value={form.responsibilities}
                onChange={onChange}
                rows={4}
                required
                placeholder="Describe the day-to-day responsibilities of this role..."
                className="min-h-[96px] w-full rounded-lg border border-white/5 bg-[#1a1a1f] px-3 py-2.5 text-[12px] leading-relaxed text-[#ededef] placeholder:text-[#6b6b76] focus-visible:border-[#5b4fe9] focus-visible:ring-0"
              />
            </Field>

            <Field
              label="Qualifications & Requirements"
              htmlFor="requirements"
              required
            >
              <Textarea
                id="requirements"
                name="requirements"
                value={form.requirements}
                onChange={onChange}
                rows={4}
                required
                placeholder={
                  "3+ years of experience with React\nStrong communication skills"
                }
                className="min-h-[96px] w-full rounded-lg border border-white/5 bg-[#1a1a1f] px-3 py-2.5 text-[12px] leading-relaxed text-[#ededef] placeholder:text-[#6b6b76] focus-visible:border-[#5b4fe9] focus-visible:ring-0"
              />
            </Field>
          </div>
        </section>

        {/* Success message */}
        {submitted ? (
          <div
            role="status"
            className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-[12px] text-emerald-300"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            Job saved successfully!
          </div>
        ) : null}

        {/* Action */}
        <div className="pb-2">
          <Button
            type="submit"
            className="h-9 gap-2 rounded-lg bg-[#5b4fe9] px-5 text-[12px] font-medium text-white shadow-[0_0_24px_-4px_#5b4fe9] hover:bg-[#6c61f0]"
          >
            Post Job
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
