import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  // Clear existing data
  await prisma.run.deleteMany()
  await prisma.job.deleteMany()
  await prisma.company.deleteMany()

  // Create Companies
  const company1 = await prisma.company.create({
    data: {
      name: 'Innovate Inc.',
      website: 'https://innovate.com',
    },
  })

  const company2 = await prisma.company.create({
    data: {
      name: 'Tech Solutions',
      website: 'https://techsolutions.dev',
    },
  })

  const company3 = await prisma.company.create({
    data: {
      name: 'Data Corp.',
      website: 'https://datacorp.ai',
    },
  })

  // Create Jobs
  const jobs = []
  for (let i = 0; i < 50; i++) {
    const company = [company1, company2, company3][i % 3]
    jobs.push(
      await prisma.job.create({
        data: {
          title: `Software Engineer ${i + 1}`,
          companyId: company.id,
          location: ['Remote', 'New York, NY', 'San Francisco, CA'][i % 3],
          salary: `${80000 + i * 1000} - ${120000 + i * 1000}`,
          postedAt: new Date(new Date().setDate(new Date().getDate() - i)),
          sourceUrl: `https://example.com/job/${i + 1}`,
        },
      })
    )
  }

  // Create Runs
  await prisma.run.create({
    data: {
      status: 'COMPLETED',
      startedAt: new Date(new Date().setHours(new Date().getHours() - 2)),
      finishedAt: new Date(new Date().setHours(new Date().getHours() - 1)),
      pagesScraped: 150,
    },
  })

  await prisma.run.create({
    data: {
      status: 'FAILED',
      startedAt: new Date(new Date().setHours(new Date().getHours() - 5)),
      finishedAt: new Date(new Date().setHours(new Date().getHours() - 4)),
      pagesScraped: 75,
      errors: JSON.stringify({ message: 'Failed to fetch page 76' }),
    },
  })

  await prisma.run.create({
    data: {
      status: 'RUNNING',
      startedAt: new Date(),
    },
  })

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
