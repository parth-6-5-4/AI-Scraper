import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting cron job simulation...')

  const jobs = await prisma.job.findMany({
    select: { id: true, title: true }
  })

  if (jobs.length === 0) {
    console.log('No jobs found in the database. Please seed the database first.')
    return
  }

  // Select a random job to run
  const randomJob = jobs[Math.floor(Math.random() * jobs.length)]
  console.log(`Selected job: "${randomJob.title}" (ID: ${randomJob.id})`)

  // 1. Start the run
  const startResponse = await fetch(`${process.env.BACKEND_BASE_URL}/api/runs/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId: randomJob.id }),
  })

  if (!startResponse.ok) {
    const error = await startResponse.json()
    console.error('Failed to start run:', error)
    return
  }

  const { runId } = await startResponse.json()
  console.log(`Run started successfully with ID: ${runId}`)

  // 2. Simulate work by waiting for a random duration
  const workDuration = Math.random() * 5000 + 1000 // 1-6 seconds
  console.log(`Simulating work for ${Math.round(workDuration / 1000)}s...`)
  await new Promise(resolve => setTimeout(resolve, workDuration))

  // 3. Complete the run with a random status
  const finalStatus = Math.random() > 0.2 ? 'COMPLETED' : 'FAILED' // 80% success rate
  console.log(`Completing run with status: ${finalStatus}`)

  const completeResponse = await fetch(`${process.env.BACKEND_BASE_URL}/api/runs/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ runId, status: finalStatus }),
  })

  if (!completeResponse.ok) {
    const error = await completeResponse.json()
    console.error('Failed to complete run:', error)
    return
  }

  console.log('Run completed successfully.')
  console.log('Cron job simulation finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
