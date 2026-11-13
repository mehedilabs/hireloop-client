import { toast } from "@/components/ui/toast"
import { FileDown } from "lucide-react"

interface ApplicationTabsProps {
  activeTab: "active" | "archived"
  onTabChange: (tab: "active" | "archived") => void
}

export function ApplicationTabs({
  activeTab,
  onTabChange,
}: ApplicationTabsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="grid w-full grid-cols-2 gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 sm:flex sm:w-fit">
        <button
          type="button"
          onClick={() => onTabChange("active")}
          className={`cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "active"
              ? "bg-[#5b4fe9] text-white shadow-sm"
              : "text-white/50 hover:bg-white/5 hover:text-white"
          }`}
        >
          Active
        </button>

        <button
          type="button"
          onClick={() => onTabChange("archived")}
          className={`cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "archived"
              ? "bg-[#5b4fe9] text-white shadow-sm"
              : "text-white/50 hover:bg-white/5 hover:text-white"
          }`}
        >
          Archived
        </button>
      </div>

      <button
        type="button"
        onClick={() =>
          toast.add({
            title: "Coming Soon!",
            description: "PDF export functionality is coming soon.",
            type: "info",
          })
        }
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
      >
        <FileDown className="size-4" />
        Export PDF
      </button>
    </div>
  )
}
