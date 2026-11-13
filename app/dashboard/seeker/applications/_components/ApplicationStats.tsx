const stats = [
  {
    title: "Total Applied",
    value: "0",
    description: "All applications",
    valueClass: "text-white",
  },
  {
    title: "Shortlisted",
    value: "0",
    description: "Applications shortlisted",
    valueClass: "text-blue-400",
  },
  {
    title: "Interviews",
    value: "0",
    description: "Interview invitations",
    valueClass: "text-amber-400",
  },
  {
    title: "Success Rate",
    value: "0%",
    description: "Application success rate",
    valueClass: "text-emerald-400",
  },
]

export function ApplicationStats() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
        >
          <p className="text-xs font-medium text-white/50 sm:text-sm">
            {stat.title}
          </p>

          <p className={`mt-3 text-2xl font-bold ${stat.valueClass}`}>
            {stat.value}
          </p>

          <p className="mt-1 text-[11px] text-white/40 sm:text-xs">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  )
}
