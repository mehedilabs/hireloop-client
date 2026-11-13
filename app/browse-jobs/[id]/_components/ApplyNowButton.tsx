"use client"

import { useRouter, usePathname } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { applyToAJob } from "@/lib/actions/applications"
import type { JobPost } from "@/lib/jobs"
import type { JobApplication } from "@/lib/types/applications"

interface ApplyNowButtonProps {
  job: Pick<
    JobPost,
    "_id" | "title" | "company" | "category" | "type" | "remote"
  >
}

export function ApplyNowButton({ job }: ApplyNowButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()

  const handleApplyNow = async () => {
    if (!session) {
      router.push(`/sign-in?callbackURL=${encodeURIComponent(pathname)}`)
      return
    }

    const user = session.user

    if (user.role === "seeker") {
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
        router.push("/browse-jobs?application=success")
      }
    } else {
      toast.add({
        title: "Access denied",
        description: "Only job seekers can apply for jobs.",
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleApplyNow}
      disabled={isPending}
      className="inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-lg bg-[#5c53fe] px-4 text-xs font-semibold text-white shadow-md shadow-[#5c53fe]/20 transition-colors hover:bg-[#7af5c0] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
    >
      Apply Now
    </button>
  )
}
