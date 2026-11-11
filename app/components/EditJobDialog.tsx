"use client"

import * as React from "react"
import { Pencil, Briefcase, MapPin, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { cn } from "@/lib/utils"
import {
  CURRENCIES,
  getFormData,
  JOB_CATEGORIES,
  JOB_TYPES,
  type JobPost,
  type JobForm,
} from "@/lib/jobs"
import { updateJob } from "@/lib/actions/jobs"
import { toast } from "@/components/ui/toast"
import { FormField, FormSection } from "@/app/components/form/FormSection"
import {
  inputClasses,
  selectClasses,
  selectContentClasses,
  textareaClasses,
} from "@/app/components/form/styles"

export function EditJobDialog({
  job,
  showLabel = false,
  className,
}: {
  job: JobPost
  showLabel?: boolean
  className?: string
}) {
  const router = useRouter()

  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState<JobForm>(() => getFormData(job))
  const [loading, setLoading] = React.useState(false)

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const update = <K extends keyof JobForm>(name: K, value: JobForm[K]) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (nextOpen) {
      setForm(getFormData(job))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)

      const result = await updateJob(job._id, form)

      if (result.matchedCount > 0) {
        setOpen(false)

        toast.add({
          title: "Job Updated",
          description: "Your job has been updated successfully.",
        })

        router.refresh()
      } else {
        toast.add({
          title: "Update Failed",
          description: "Could not update this job.",
        })
      }
    } catch (error) {
      console.error("Failed to update job:", error)

      toast.add({
        title: "Update Failed",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="default"
            aria-label={`Edit ${job.title}`}
            className={
              className ||
              (showLabel
                ? "inline-flex h-8 items-center gap-1.5 rounded-md border border-[#5c53fe]/30 bg-[#5c53fe]/10 px-3 text-xs font-medium text-[#c3c0ff] hover:bg-[#5c53fe]/20"
                : "size-8 rounded-md border border-white/10 text-[#a5a5b0] hover:border-[#5b4fe9]/40 hover:bg-[#5b4fe9]/10 hover:text-[#c3c0ff]")
            }
          >
            <Pencil className={showLabel ? "size-3.5" : "size-4"} />
            {showLabel && "Update"}
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto border border-white/10 bg-[#101014] text-[#ededef] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Job</DialogTitle>

          <DialogDescription className="text-[#8a8a95]">
            Update the details of your job posting.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection icon={Briefcase} title="Job Info">
            <FormField label="Job Title" htmlFor="edit-title" required full>
              <Input
                id="edit-title"
                name="title"
                value={form.title}
                onChange={onChange}
                required
                className={inputClasses}
              />
            </FormField>
            <FormField
              label="Company Name"
              htmlFor="edit-company"
              required
              full
            >
              <Input
                id="edit-company"
                name="company"
                value={form.company}
                onChange={onChange}
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

              <FormField label="Salary Min" htmlFor="edit-salaryMin">
                <Input
                  id="edit-salaryMin"
                  name="salaryMin"
                  type="number"
                  min={0}
                  value={form.salaryMin}
                  onChange={onChange}
                  className={inputClasses}
                />
              </FormField>

              <FormField label="Salary Max" htmlFor="edit-salaryMax">
                <Input
                  id="edit-salaryMax"
                  name="salaryMax"
                  type="number"
                  min={0}
                  value={form.salaryMax}
                  onChange={onChange}
                  className={inputClasses}
                />
              </FormField>
            </div>

            <FormField
              label="Application Deadline"
              htmlFor="edit-deadline"
              full
            >
              <Input
                id="edit-deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={onChange}
                className={cn(inputClasses, "[color-scheme:dark]")}
              />
            </FormField>
          </FormSection>

          <FormSection icon={MapPin} title="Location">
            <label
              htmlFor="edit-remote"
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 sm:col-span-2",
                form.remote
                  ? "border-[#5b4fe9]/50 bg-[#5b4fe9]/10"
                  : "border-white/10 bg-[#0c0c0f]"
              )}
            >
              <Checkbox
                id="edit-remote"
                checked={form.remote}
                onCheckedChange={(checked) =>
                  update("remote", checked === true)
                }
                className="size-4 rounded border-white/20 bg-[#0c0c0f] data-checked:border-[#5b4fe9] data-checked:bg-[#5b4fe9]"
              />

              <span className="text-[13px] text-[#ededef]">
                This is a remote job
              </span>
            </label>

            <FormField label="City" htmlFor="edit-city">
              <Input
                id="edit-city"
                name="city"
                value={form.city}
                onChange={onChange}
                disabled={form.remote}
                className={inputClasses}
              />
            </FormField>

            <FormField label="Country" htmlFor="edit-country">
              <Input
                id="edit-country"
                name="country"
                value={form.country}
                onChange={onChange}
                disabled={form.remote}
                className={inputClasses}
              />
            </FormField>
          </FormSection>

          <FormSection icon={FileText} title="Job Description">
            <FormField
              label="Responsibilities"
              htmlFor="edit-responsibilities"
              required
              full
            >
              <Textarea
                id="edit-responsibilities"
                name="responsibilities"
                value={form.responsibilities}
                onChange={onChange}
                rows={4}
                required
                className={cn(textareaClasses, "min-h-[96px]")}
              />
            </FormField>

            <FormField
              label="Requirements"
              htmlFor="edit-requirements"
              required
              full
            >
              <Textarea
                id="edit-requirements"
                name="requirements"
                value={form.requirements}
                onChange={onChange}
                rows={4}
                required
                className={cn(textareaClasses, "min-h-[96px]")}
              />
            </FormField>

            <FormField label="Benefits" htmlFor="edit-benefits" full>
              <Textarea
                id="edit-benefits"
                name="benefits"
                value={form.benefits}
                onChange={onChange}
                rows={2}
                className={cn(textareaClasses, "min-h-[64px]")}
              />
            </FormField>
          </FormSection>

          <DialogFooter className="flex-row justify-end">
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="border-white/10 bg-[#1a1a1f] text-[#ededef] hover:bg-[#222228]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#5b4fe9] text-white hover:bg-[#6c61f0]"
            >
              {loading ? "Updating..." : "Update Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
