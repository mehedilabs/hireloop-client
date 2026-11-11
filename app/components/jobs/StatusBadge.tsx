import { cn } from "@/lib/utils"
import { STATUS_CLASSES, type JobStatus } from "@/lib/jobs"

/** Rounded status pill with a small dot ("Active" / "expired"). */
export function StatusBadge({
  status,
  className,
}: {
  status: JobStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center gap-1.5 rounded-full px-2.5 text-[10px] font-medium whitespace-nowrap",
        STATUS_CLASSES[status],
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
