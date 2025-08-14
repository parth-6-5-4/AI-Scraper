import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const recentRuns = await prisma.run.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        createdAt: true,
        job: {
          select: {
            title: true,
          },
        },
      },
    })

    return NextResponse.json(recentRuns)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching activity.' },
      { status: 500 }
    )
  }
}
