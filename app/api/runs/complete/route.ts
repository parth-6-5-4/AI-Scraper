import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const completeRunSchema = z.object({
  runId: z.string().cuid(),
  status: z.enum(['COMPLETED', 'FAILED']),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = completeRunSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { runId, status } = validated.data

    const run = await prisma.run.findUnique({
      where: { id: runId },
    })

    if (!run) {
      return NextResponse.json({ error: 'Run not found' }, { status: 404 })
    }

    if (run.status !== 'RUNNING') {
      return NextResponse.json({ error: 'Run is not currently running' }, { status: 400 })
    }

    const completedAt = new Date()
    const duration = completedAt.getTime() - run.startedAt.getTime()

    const updatedRun = await prisma.run.update({
      where: { id: runId },
      data: {
        status,
        completedAt,
        duration,
      },
    })

    return NextResponse.json({ runId: updatedRun.id, message: `Run marked as ${status}` })

  } catch (error) {
    console.error('Error completing run:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while completing the run.' },
      { status: 500 }
    )
  }
}
