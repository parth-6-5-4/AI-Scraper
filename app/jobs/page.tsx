import JobsClient from './JobsClient'

export const metadata = {
  title: 'Jobs | AI Scraper Pro',
  description: 'Browse and manage all scraped jobs.',
}

const JobsPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gradient">Jobs</h1>
      </div>
      <JobsClient />
    </div>
  )
}

export default JobsPage
