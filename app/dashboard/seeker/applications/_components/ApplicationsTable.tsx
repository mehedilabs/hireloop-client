import { Eye, FileText } from "lucide-react"

export function ApplicationsTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr className="text-xs font-semibold text-white/50">
              <th className="px-5 py-4">Job Title</th>
              <th className="px-5 py-4">Company</th>
              <th className="px-5 py-4">Applied</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={5} className="px-5 py-16 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/5">
                  <Eye className="size-5 text-white/40" />
                </div>
                <p className="mt-4 text-sm font-medium text-white">
                  No applications found
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Your job applications will appear here.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="flex flex-col items-center px-4 py-12 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-white/5">
            <FileText className="size-5 text-white/40" />
          </div>
          <p className="mt-3 text-sm font-medium text-white">
            No applications found
          </p>
          <p className="mt-1 max-w-[240px] text-xs leading-5 text-white/40">
            Your job applications will appear here.
          </p>
        </div>
      </div>
    </div>
  )
}
