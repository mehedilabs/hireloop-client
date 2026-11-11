import { getJobs } from "@/lib/api/jobs"

const BrowseJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const search = await searchParams
  const urlsearch = new URLSearchParams(search as Record<string, string>)
  const query = urlsearch.toString()

  const jobs = await getJobs(query)

  return <div></div>
}

export default BrowseJobsPage
