"use client"

import * as React from "react"

import { useRouter } from "next/navigation"
import {
  Briefcase,
  CheckCircle2,
  FileText,
  MapPin,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { createJob } from "@/lib/actions/jobs"

const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Customer Support",
  "Human Resources",
  "Operations",
]

const JOB_TYPES = ["Full-time", "Part-time", "Remote", "Contract", "Internship"]

const CURRENCIES = ["PHP", "USD", "EUR", "GBP", "SGD"]

export type JobForm = {
  title: string
  category: string
  type: string
  salaryMin: string
  salaryMax: string
  currency: string
  city: string
  country: string
  remote: boolean
  deadline: string
  responsibilities: string
  requirements: string
  benefits: string
}

const initialForm: JobForm = {
  title: "",
  category: "",
  type: "",
  salaryMin: "",
  salaryMax: "",
  currency: "PHP",
  city: "",
  country: "",
  remote: false,
  deadline: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
}

const inputClasses =
  "h-10 rounded-lg border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] placeholder:text-[#6e6e78] transition-colors hover:border-white/20 focus-visible:border-[#5b4fe9] focus-visible:ring-[3px] focus-visible:ring-[#5b4fe9]/25 disabled:cursor-not-allowed disabled:opacity-40 md:text-[13px] dark:bg-[#0c0c0f] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&[type=number]]:[appearance:textfield]"

const selectClasses =
  "w-full rounded-lg border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] transition-colors hover:border-white/20 data-placeholder:text-[#6e6e78] data-[size=default]:h-10 focus-visible:border-[#5b4fe9] focus-visible:ring-[3px] focus-visible:ring-[#5b4fe9]/25 dark:bg-[#0c0c0f]"

const selectContentClasses =
  "rounded-lg border-white/10 bg-[#1a1a1f] text-[#ededef] shadow-xl ring-white/10"

const textareaClasses =
  "rounded-lg border-white/10 bg-[#0c0c0f] px-3 py-2.5 text-[13px] leading-relaxed text-[#ededef] placeholder:text-[#6e6e78] transition-colors hover:border-white/20 focus-visible:border-[#5b4fe9] focus-visible:ring-[3px] focus-visible:ring-[#5b4fe9]/25 md:text-[13px] dark:bg-[#0c0c0f]"

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-white/[0.07] bg-[#141418]">
      <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
        <span className="flex size-7 items-center justify-center rounded-lg bg-[#5b4fe9]/15 text-[#a79cf8] ring-1 ring-[#5b4fe9]/25">
          <Icon className="size-3.5" />
        </span>
        <h2 className="text-[14px] font-semibold tracking-tight text-[#ededef]">
          {title}
        </h2>
      </div>
      <div className="grid gap-3.5 p-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  full = false,
  required = false,
  hint,
  children,
}: {
  label: string
  htmlFor?: string
  full?: boolean
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("space-y-1.5", full && "sm:col-span-2")}>
      <Label
        htmlFor={htmlFor}
        className="text-[12px] font-medium text-[#c8c8d0]"
      >
        {label}
        {required ? <span className="ml-0.5 text-[#f87171]">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-[11px] text-[#6e6e78]">{hint}</p> : null}
    </div>
  )
}

export default function NewJobPage() {
  const router = useRouter()
  const [form, setForm] = React.useState<JobForm>(initialForm)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = await createJob(form)

    setSubmitted(true)
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col px-4 py-6 sm:py-8">
      {/* Header */}
      <header className="mb-5 text-center">
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-[#ededef] sm:text-2xl">
          Create Job Post
        </h1>
        <p className="mt-1 text-[13px] text-[#8a8a95]">
          Fill in the details below to publish a new listing.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Info */}
        <Section icon={Briefcase} title="Job Info">
          <Field label="Job Title" htmlFor="title" required full>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="e.g. Senior Frontend Engineer"
              required
              className={inputClasses}
            />
          </Field>

          <Field label="Category">
            <Select
              value={form.category}
              onValueChange={(value) => update("category", value ?? "")}
            >
              <SelectTrigger className={selectClasses}>
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

          <Field label="Job Type">
            <Select
              value={form.type}
              onValueChange={(value) => update("type", value ?? "")}
            >
              <SelectTrigger className={selectClasses}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className={selectContentClasses}>
                {JOB_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Salary row */}
          <div className="grid grid-cols-[88px_1fr_1fr] gap-3 sm:col-span-2">
            <Field label="Currency">
              <Select
                value={form.currency}
                onValueChange={(value) => update("currency", value ?? "")}
              >
                <SelectTrigger className={selectClasses}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentClasses}>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Salary Min" htmlFor="salaryMin">
              <Input
                id="salaryMin"
                name="salaryMin"
                type="number"
                min={0}
                value={form.salaryMin}
                onChange={onChange}
                placeholder="30000"
                className={inputClasses}
              />
            </Field>

            <Field label="Salary Max" htmlFor="salaryMax">
              <Input
                id="salaryMax"
                name="salaryMax"
                type="number"
                min={0}
                value={form.salaryMax}
                onChange={onChange}
                placeholder="50000"
                className={inputClasses}
              />
            </Field>
          </div>

          <Field
            label="Application Deadline"
            htmlFor="deadline"
            full
            hint="Leave empty if the listing stays open until filled."
          >
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={onChange}
              className={cn(inputClasses, "[color-scheme:dark]")}
            />
          </Field>
        </Section>

        {/* Location */}
        <Section icon={MapPin} title="Location">
          <label
            htmlFor="remote"
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors sm:col-span-2",
              form.remote
                ? "border-[#5b4fe9]/50 bg-[#5b4fe9]/10"
                : "border-white/10 bg-[#0c0c0f] hover:border-white/20"
            )}
          >
            <Checkbox
              id="remote"
              checked={form.remote}
              onCheckedChange={(checked) => update("remote", checked === true)}
              className="size-4 rounded border-white/20 bg-[#0c0c0f] dark:bg-[#0c0c0f] data-checked:border-[#5b4fe9] data-checked:bg-[#5b4fe9]"
            />
            <span className="text-[13px] text-[#ededef]">
              This is a remote job
            </span>
          </label>

          <Field label="City" htmlFor="city">
            <Input
              id="city"
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="Makati City"
              disabled={form.remote}
              className={inputClasses}
            />
          </Field>

          <Field label="Country" htmlFor="country">
            <Input
              id="country"
              name="country"
              value={form.country}
              onChange={onChange}
              placeholder="Philippines"
              disabled={form.remote}
              className={inputClasses}
            />
          </Field>
        </Section>

        {/* Job Description */}
        <Section icon={FileText} title="Job Description">
          <Field
            label="Responsibilities"
            htmlFor="responsibilities"
            required
            full
            hint="One responsibility per line."
          >
            <Textarea
              id="responsibilities"
              name="responsibilities"
              value={form.responsibilities}
              onChange={onChange}
              rows={4}
              required
              placeholder={
                "Build and maintain product features\nCollaborate with the design team"
              }
              className={cn(textareaClasses, "min-h-[96px]")}
            />
          </Field>

          <Field
            label="Requirements"
            htmlFor="requirements"
            required
            full
            hint="One requirement per line."
          >
            <Textarea
              id="requirements"
              name="requirements"
              value={form.requirements}
              onChange={onChange}
              rows={4}
              required
              placeholder={
                "3+ years of experience\nStrong communication skills"
              }
              className={cn(textareaClasses, "min-h-[96px]")}
            />
          </Field>

          <Field label="Benefits" htmlFor="benefits" full hint="Optional.">
            <Textarea
              id="benefits"
              name="benefits"
              value={form.benefits}
              onChange={onChange}
              rows={2}
              placeholder="Health insurance, 13th month pay, remote stipend"
              className={cn(textareaClasses, "min-h-[64px]")}
            />
          </Field>
        </Section>

        {/* Success message */}
        {submitted ? (
          <div
            role="status"
            className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-[12px] text-emerald-300"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            Job saved successfully!
          </div>
        ) : null}

        {/* Actions (centered) */}
        <div className="flex items-center justify-center gap-3 pt-1 pb-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/dashboard/recruiter/jobs")}
            className="h-10 flex-1 rounded-lg border-white/10 bg-[#1a1a1f] px-5 text-[13px] text-[#ededef] hover:bg-[#222228] sm:max-w-[140px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-10 flex-1 rounded-lg bg-[#5b4fe9] px-6 text-[13px] font-medium text-white hover:bg-[#6c61f0] sm:max-w-[160px]"
          >
            Post Job
          </Button>
        </div>
      </form>
    </div>
  )
}
