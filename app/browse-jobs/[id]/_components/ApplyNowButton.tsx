"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { applyToAJob } from "@/lib/actions/applications"
import { getMyApplications } from "@/lib/api/applications"
import type { JobPost } from "@/lib/jobs"
import type { JobApplication } from "@/lib/types/applications"
import { getApplicationsCount } from "@/lib/api/applications"

interface ApplyNowButtonProps {
  job: Pick<
    JobPost,
    "_id" | "title" | "company" | "category" | "type" | "remote"
  >
  isApplied?: boolean
  onApplied?: () => void
  redirectOnSuccess?: boolean
}

export function ApplyNowButton({
  job,
  isApplied = false,
  onApplied,
  redirectOnSuccess = true,
}: ApplyNowButtonProps) {
  const router = useRouter()
  const pathname = usePathname()

  const { data: session, isPending } = authClient.useSession()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasApplied, setHasApplied] = useState(isApplied)
  const [checkingApplication, setCheckingApplication] = useState(true)

  const userId = session?.user?.id

  useEffect(() => {
    let ignore = false

    const checkApplication = async () => {
      if (!userId) {
        setHasApplied(false)
        setCheckingApplication(false)
        return
      }

      try {
        const applications = await getMyApplications(userId)

        if (!ignore) {
          const alreadyApplied = applications.some(
            (application) => application.jobId === job._id
          )

          setHasApplied(isApplied || alreadyApplied)
        }
      } catch {
        if (!ignore) {
          setHasApplied(isApplied)
        }
      } finally {
        if (!ignore) {
          setCheckingApplication(false)
        }
      }
    }

    checkApplication()

    return () => {
      ignore = true
    }
  }, [userId, job._id, isApplied])

  const handleApplyNow = async () => {
    if (!session) {
      router.push(`/sign-in?callbackURL=${encodeURIComponent(pathname)}`)
      return
    }

    if (hasApplied || isSubmitting) return

    const user = session.user

    if (user.role !== "seeker") {
      toast.add({
        title: "Access denied",
        description: "Only job seekers can apply for jobs.",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Check the user's total applications
      const countResult = await getApplicationsCount(user.id)

      // Free application limit: 10
      if (countResult.count >= 10) {
        router.push("/checkout")
        return
      }
      const application: JobApplication = {
        jobId: job._id,
        userId: user.id,
        email: user.email,
        jobTitle: job.title,
        companyName: job.company,
        category: job.category,
        jobType: job.type,
        remote: job.remote,
        appliedAt: new Date().toISOString(),
        status: "Applied",
      }

      const result = await applyToAJob(application)

      if (result.insertedId) {
        setHasApplied(true)

        if (redirectOnSuccess) {
          router.push("/browse-jobs?application=success")
        } else {
          onApplied?.()

          toast.add({
            title: "Application submitted",
            description: "You have successfully applied for this job.",
            type: "success",
          })
        }
      }
    } catch {
      toast.add({
        title: "Application failed",
        description: "Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleApplyNow}
      disabled={isPending || checkingApplication || isSubmitting || hasApplied}
      className={`inline-flex h-9 w-full items-center justify-center rounded-lg px-4 text-xs font-semibold shadow-md transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        hasApplied
          ? "bg-emerald-500/15 text-emerald-400 shadow-none"
          : "cursor-pointer bg-[#5c53fe] text-white shadow-[#5c53fe]/20 hover:bg-[#7af5c0] hover:text-black"
      }`}
    >
      {hasApplied
        ? "Applied ✓"
        : checkingApplication
          ? "Checking..."
          : isSubmitting
            ? "Applying..."
            : "Apply Now"}
    </button>
  )
}
