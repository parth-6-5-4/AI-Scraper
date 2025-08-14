import FeatureCard from '@/components/dashboard/FeatureCard'
import ActivityItem from '@/components/dashboard/ActivityItem'
import { BarChart, Zap, Clock, AlertTriangle } from 'lucide-react'
import prisma from '@/lib/prisma'
import { formatDistanceToNow } from 'date-fns'
import StatCard, { StatCardProps } from '@/components/dashboard/StatCard'

// This is a server component, so we can fetch data directly.
async function getStats(): Promise<StatCardProps[]> {
  const [totalJobs, activeScrapers, errorsLast24h, avgRunTimeData] = await prisma.$transaction([
    prisma.job.count(),
    prisma.run.count({ where: { status: 'RUNNING' } }),
    prisma.run.count({ 
      where: { 
        status: 'FAILED', 
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    }),
    prisma.run.aggregate({
      where: { status: 'COMPLETED', duration: { not: null } },
      _avg: { duration: true },
    })
  ])

  const avgRunTime = avgRunTimeData._avg.duration || 0;
  const minutes = Math.floor(avgRunTime / 60000);
    const seconds = Math.floor((avgRunTime % 60000) / 1000);

    return [
    { title: 'Total Jobs Tracked', value: totalJobs.toLocaleString(), icon: BarChart, variant: 'default' },
    { title: 'Active Scrapers', value: activeScrapers.toLocaleString(), icon: Zap, variant: 'default' },
    { title: 'Avg. Run Time', value: `${minutes}m ${seconds}s`, icon: Clock, variant: 'default' },
    { title: 'Errors Last 24h', value: errorsLast24h.toLocaleString(), icon: AlertTriangle, variant: 'destructive' },
  ]
}

async function getActivity() {
  const recentRuns = await prisma.run.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { 
      id: true, 
      status: true, 
      createdAt: true, 
      job: { 
        select: { 
          title: true 
        } 
      } 
    },
  })

      return recentRuns.map((run: { id: string; status: string; createdAt: Date; job: { title: string } }) => ({
    status: run.status as 'COMPLETED' | 'FAILED' | 'RUNNING',
    description: `${run.status === 'COMPLETED' ? 'Completed' : run.status === 'FAILED' ? 'Failed' : 'Started'} run for "${run.job.title}"`,
    time: `${formatDistanceToNow(new Date(run.createdAt))} ago`,
  }))
}

const features = [
  { title: 'Run New Scraper', description: 'Start a new data scraping job.', link: '/jobs/new' },
  { title: 'View All Jobs', description: 'Browse, filter, and export all tracked jobs.', link: '/jobs' },
  { title: 'Monitor Runs', description: 'Check the status of all scraping runs.', link: '/runs' },
  { title: 'Analytics', description: 'Visualize trends and insights from scraped data.', link: '/analytics' },
]

const DashboardPage = async () => {
  const stats = await getStats();
  const activities = await getActivity();
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-gradient">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Features Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((activity: { status: 'COMPLETED' | 'FAILED' | 'RUNNING'; description: string; time: string; }, index: number) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
