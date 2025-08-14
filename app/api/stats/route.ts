import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const [totalJobs, activeScrapers, errorsLast24h, avgRunTimeData] = await prisma.$transaction([
      prisma.job.count(),
      prisma.run.count({ where: { status: 'RUNNING' } }),
      prisma.run.count({ 
        where: { 
          status: 'FAILED', 
          createdAt: { gte: twentyFourHoursAgo }
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
    const formattedAvgRunTime = `${minutes}m ${seconds}s`;

    return NextResponse.json({
      totalJobsTracked: totalJobs,
      activeScrapers: activeScrapers,
      avgRunTime: formattedAvgRunTime,
      errorsLast24h: errorsLast24h,
    })

  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching stats.' },
      { status: 500 }
    )
  }
}
