import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Starting cleanup...')

  // Delete all demo projects (this will cascade delete transactions)
  const result = await prisma.project.deleteMany({
    where: {
      name: {
        startsWith: '[DEMO]',
      },
    },
  })

  console.log(`✅ Deleted ${result.count} demo projects and their transactions`)
  console.log('Database cleaned successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error cleaning database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
