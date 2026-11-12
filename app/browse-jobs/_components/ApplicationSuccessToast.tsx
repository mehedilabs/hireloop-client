"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { toast } from "@/components/ui/toast"

export function ApplicationSuccessToast() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const toastShown = useRef(false)

  useEffect(() => {
    if (searchParams.get("application") !== "success" || toastShown.current) {
      return
    }

    toastShown.current = true

    toast.add({
      title: "Application submitted successfully!",
      description: "Your job application has been submitted.",
    })

    const params = new URLSearchParams(searchParams.toString())
    params.delete("application")

    const query = params.toString()

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    })
  }, [searchParams, pathname, router])

  return null
}
