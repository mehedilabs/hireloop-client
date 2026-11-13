"use client"

import { useState } from "react"
import { FileDown } from "lucide-react"

export function ApplicationTabs() {
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active")

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-fit items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "active"
              ? "bg-[#5b4fe9] text-white"
              : "text-white/50 hover:text-white"
          }`}
        >
          Active
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("archived")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "archived"
              ? "bg-[#5b4fe9] text-white"
              : "text-white/50 hover:text-white"
          }`}
        >
          Archived
        </button>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
      >
        <FileDown className="size-4" />
        Export PDF
      </button>
    </div>
  )
}
