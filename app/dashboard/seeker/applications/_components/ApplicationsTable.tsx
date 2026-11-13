"use client"

import { useState } from "react"
import { Archive, ArchiveRestore, Eye, FileText, X } from "lucide-react"

import type { JobApplication } from "@/lib/types/applications"

interface ApplicationsTableProps {
  applications: JobApplication[]
  onArchiveToggle: (application: JobApplication) => Promise<void>
  updatingApplicationId: string | null
}

export function ApplicationsTable({
  applications,
  onArchiveToggle,
  updatingApplicationId,
}: ApplicationsTableProps) {
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null)

  const hasApplications = applications.length > 0

  const getStatusStyles = (status: JobApplication["status"]) => {
    switch (status) {
      case "Applied":
        return "border-blue-400/20 bg-blue-400/10 text-blue-300"
      case "Review":
        return "border-amber-400/20 bg-amber-400/10 text-amber-300"
      case "Shortlisted":
        return "border-purple-400/20 bg-purple-400/10 text-purple-300"
      case "Rejected":
        return "border-red-400/20 bg-red-400/10 text-red-300"
      case "Offered":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      default:
        return "border-white/10 bg-white/5 text-white/60"
    }
  }

  const renderStatus = (status: JobApplication["status"]) => (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyles(status)}`}
    >
      {status}
    </span>
  )

  const renderArchiveButton = (application: JobApplication) => {
    const isUpdating = updatingApplicationId === application._id

    return (
      <button
        type="button"
        disabled={isUpdating || !application._id}
        onClick={() => onArchiveToggle(application)}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-white/50 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {application.isArchived ? (
          <>
            <ArchiveRestore className="size-4" />
            Unarchive
          </>
        ) : (
          <>
            <Archive className="size-4" />
            Archive
          </>
        )}
      </button>
    )
  }

  const renderViewButton = (application: JobApplication) => (
    <button
      type="button"
      onClick={() => setSelectedApplication(application)}
      aria-label={`View ${application.jobTitle} application`}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-[#a99fff] transition hover:bg-[#5b4fe9]/10 hover:text-white"
    >
      <Eye className="size-4" />
      View
    </button>
  )

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111113] shadow-lg shadow-black/10">
        {/* Desktop Table */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b border-white/10 bg-white/[0.03]">
              <tr className="text-xs font-semibold tracking-wider text-white/40 uppercase">
                <th className="px-5 py-4">Job Title</th>
                <th className="px-5 py-4">Company</th>
                <th className="px-5 py-4">Applied Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {hasApplications ? (
                applications.map((application) => (
                  <tr
                    key={application._id ?? application.jobId}
                    className="border-b border-white/5 text-sm text-white/70 transition-colors last:border-0 hover:bg-white/[0.025]"
                  >
                    <td className="max-w-[220px] px-5 py-5">
                      <p className="truncate font-medium text-white">
                        {application.jobTitle}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <span className="text-white/60">
                        {application.companyName}
                      </span>
                    </td>

                    <td className="px-5 py-5 text-white/50">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-5">
                      {renderStatus(application.status)}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center justify-end gap-1">
                        {renderViewButton(application)}
                        {renderArchiveButton(application)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                      <FileText className="size-5 text-white/40" />
                    </div>

                    <p className="mt-4 text-sm font-medium text-white">
                      No applications found
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Your job applications will appear here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 p-3 sm:hidden">
          {hasApplications ? (
            applications.map((application) => (
              <div
                key={application._id ?? application.jobId}
                className="rounded-lg border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm leading-5 font-semibold break-words text-white">
                      {application.jobTitle}
                    </h3>

                    <p className="mt-1.5 truncate text-xs text-white/50">
                      {application.companyName}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {renderStatus(application.status)}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <div>
                    <p className="text-[11px] text-white/40">Applied Date</p>

                    <p className="mt-1 text-xs font-medium text-white/70">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {renderViewButton(application)}
                    {renderArchiveButton(application)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center px-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <FileText className="size-5 text-white/40" />
              </div>

              <p className="mt-4 text-sm font-medium text-white">
                No applications found
              </p>

              <p className="mt-1 max-w-[240px] text-xs leading-5 text-white/40">
                Your job applications will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-details-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#171719] p-4 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2
                  id="application-details-title"
                  className="text-lg font-semibold text-white"
                >
                  Application Details
                </h2>

                <p className="mt-1 text-xs text-white/40 sm:text-sm">
                  View your submitted application information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                aria-label="Close application details"
                className="shrink-0 rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs text-white/40">Job Title</p>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  {selectedApplication.jobTitle}
                </p>

                <p className="mt-1 text-xs text-white/50">
                  {selectedApplication.companyName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/[0.03] p-3">
                  <p className="text-xs text-white/40">Category</p>
                  <p className="mt-1.5 text-sm break-words text-white">
                    {selectedApplication.category}
                  </p>
                </div>

                <div className="rounded-lg bg-white/[0.03] p-3">
                  <p className="text-xs text-white/40">Job Type</p>
                  <p className="mt-1.5 text-sm break-words text-white">
                    {selectedApplication.jobType}
                  </p>
                </div>

                <div className="rounded-lg bg-white/[0.03] p-3">
                  <p className="text-xs text-white/40">Work Location</p>
                  <p className="mt-1.5 text-sm text-white">
                    {selectedApplication.remote ? "Remote" : "On-site"}
                  </p>
                </div>

                <div className="rounded-lg bg-white/[0.03] p-3">
                  <p className="text-xs text-white/40">Status</p>
                  <div className="mt-1.5">
                    {renderStatus(selectedApplication.status)}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white/[0.03] p-3">
                <p className="text-xs text-white/40">Applied Date</p>
                <p className="mt-1.5 text-sm text-white">
                  {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="rounded-lg bg-white/[0.03] p-3">
                <p className="text-xs text-white/40">Email</p>
                <p className="mt-1.5 text-sm break-all text-white">
                  {selectedApplication.email}
                </p>
              </div>

              <div className="rounded-lg bg-white/[0.03] p-3">
                <p className="text-xs text-white/40">Archive Status</p>
                <p className="mt-1.5 text-sm text-white">
                  {selectedApplication.isArchived ? "Archived" : "Active"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedApplication(null)}
              className="mt-5 w-full rounded-lg bg-[#5b4fe9] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d42d5]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
