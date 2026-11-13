import { ApplicationFilters } from "./_components/ApplicationFilters"
import { ApplicationPagination } from "./_components/ApplicationPagination"
import { ApplicationsTable } from "./_components/ApplicationsTable"
import { ApplicationStats } from "./_components/ApplicationStats"
import { ApplicationTabs } from "./_components/ApplicationTabs"

const MyApplicationsPage = () => {
  return (
    <div className="min-h-screen bg-[#0c0c0d] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Applications
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Track your job applications and interview progress
          </p>
        </div>

        <ApplicationStats />
        <ApplicationTabs />
        <ApplicationFilters />
        <ApplicationsTable />
        <ApplicationPagination />
      </div>
    </div>
  )
}

export default MyApplicationsPage
