"use client"

import * as React from "react"

import { useRouter } from "next/navigation"
import {
  Briefcase,
  CheckCircle2,
  FileText,
  MapPin,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  CURRENCIES,
  JOB_CATEGORIES,
  JOB_TYPES,
  initialForm,
  type JobForm,
} from "@/lib/jobs"
import {
  FormField,
  FormSection,
} from "@/app/components/form/FormSection"
import {
  inputClasses,
  selectClasses,
  selectContentClasses,
  textareaClasses,
} from "@/app/components/form/styles"

// The single JobForm definition lives in @/lib/jobs; re-export it here so
// existing imports from this page keep working.
export type { JobForm }

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

  if (result?.acknowledged) {
    setSubmitted(true)

    toast.add({
      title: "Job Posted",
      description: "Your job has been posted successfully.",
    })

    router.push('/dashboard/recruiter/jobs')
  }
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
        <FormSection icon={Briefcase} title="Job Info">
          <FormField label="Job Title" htmlFor="title" required full>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="e.g. Senior Frontend Engineer"
              required
              className={inputClasses}
            />
          </FormField>

          <FormField label="Category">
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
          </FormField>

          <FormField label="Job Type">
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
          </FormField>

          {/* Salary row */}
          <div className="grid grid-cols-[88px_1fr_1fr] gap-3 sm:col-span-2">
            <FormField label="Currency">
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
            </FormField>

            <FormField label="Salary Min" htmlFor="salaryMin">
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
            </FormField>

            <FormField label="Salary Max" htmlFor="salaryMax">
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
            </FormField>
          </div>

          <FormField
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
          </FormField>
        </FormSection>

        {/* Location */}
        <FormSection icon={MapPin} title="Location">
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

          <FormField label="City" htmlFor="city">
            <Input
              id="city"
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="Makati City"
              disabled={form.remote}
              className={inputClasses}
            />
          </FormField>

          <FormField label="Country" htmlFor="country">
            <Input
              id="country"
              name="country"
              value={form.country}
              onChange={onChange}
              placeholder="Philippines"
              disabled={form.remote}
              className={inputClasses}
            />
          </FormField>
        </FormSection>

        {/* Job Description */}
        <FormSection icon={FileText} title="Job Description">
          <FormField
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
          </FormField>

          <FormField
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
          </FormField>

          <FormField label="Benefits" htmlFor="benefits" full hint="Optional.">
            <Textarea
              id="benefits"
              name="benefits"
              value={form.benefits}
              onChange={onChange}
              rows={2}
              placeholder="Health insurance, 13th month pay, remote stipend"
              className={cn(textareaClasses, "min-h-[64px]")}
            />
          </FormField>
        </FormSection>

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
