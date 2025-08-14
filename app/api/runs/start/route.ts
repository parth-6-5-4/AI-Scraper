import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const startRunSchema = z.object({
  jobId: z.string().cuid(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = startRunSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { jobId } = validated.data

    // Check if the job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const newRun = await prisma.run.create({
      data: {
        jobId,
        status: 'RUNNING',
        startedAt: new Date(),
      },
    })

    return NextResponse.json({ runId: newRun.id, message: 'Run started successfully' })

  } catch (error) {
    console.error('Error starting run:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while starting the run.' },
      { status: 500 }
    )
  }
}
