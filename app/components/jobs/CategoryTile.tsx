import { cn } from "@/lib/utils"
import { categoryStyle } from "@/lib/jobs"

/** Coloured icon tile for a job's category (falls back to neutral grey). */
export function CategoryTile({
  category,
  className,
  iconClassName,
}: {
  category: string
  className?: string
  iconClassName?: string
}) {
  const { color, icon: Icon } = categoryStyle(category)

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.06]",
        className
      )}
      style={{ color, backgroundColor: `${color}1a` }}
    >
      <Icon className={cn("size-4", iconClassName)} />
    </span>
  )
}
