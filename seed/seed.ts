import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SEED_PROJECTS = [
  {
    name: '[DEMO] Residential Building - Makati',
    description: 'Modern 5-story residential building with commercial ground floor',
    totalBudget: 5000000,
    status: 'ACTIVE',
  },
  {
    name: '[DEMO] Office Renovation - BGC',
    description: 'Complete office space renovation including electrical and HVAC',
    totalBudget: 2500000,
    status: 'ACTIVE',
  },
  {
    name: '[DEMO] Warehouse Construction - Laguna',
    description: 'Industrial warehouse with loading docks and office area',
    totalBudget: 3500000,
    status: 'PRE_BIDDING',
  },
  {
    name: '[DEMO] School Building Repair - Quezon City',
    description: 'Structural repairs and painting of 3-story school building',
    totalBudget: 1500000,
    status: 'COMPLETED',
  },
  {
    name: '[DEMO] Shopping Mall Expansion - Pasig',
    description: 'New wing addition with retail spaces and parking',
    totalBudget: 8000000,
    status: 'ON_HOLD',
  },
]

async function generateTransactions(projectId: string, projectBudget: number, projectStatus: string) {
  const transactions = []
  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] // Jan to Dec 2025

  // Determine how many months of data based on status
  let activeMonths = months
  if (projectStatus === 'PRE_BIDDING') {
    activeMonths = months.slice(0, 2) // Only Jan-Feb
  } else if (projectStatus === 'COMPLETED') {
    activeMonths = months.slice(0, 10) // Jan-Oct
  } else if (projectStatus === 'ON_HOLD') {
    activeMonths = months.slice(0, 6) // Jan-Jun
  }

  for (const month of activeMonths) {
    // Generate 1-3 transactions per month
    const transactionCount = Math.floor(Math.random() * 3) + 1

    for (let i = 0; i < transactionCount; i++) {
      const isIncome = Math.random() > 0.6 // 40% income, 60% expense
      const day = Math.floor(Math.random() * 28) + 1
      const date = new Date(2025, month, day)

      if (isIncome) {
        // Income transaction
        transactions.push({
          projectId,
          amount: Math.floor(Math.random() * (projectBudget * 0.3)) + 50000,
          transactionType: 'INCOME',
          category: 'OTHER',
          reason: 'Client payment - Progress billing',
          vendorName: 'Client',
          date,
          paymentStatus: Math.random() > 0.3 ? 'PAID' : 'PENDING',
          phase: 'CONSTRUCTION',
          invoiceNumber: `INV-2025-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
          imageUrls: [],
        })
      } else {
        // Expense transaction
        const categories = ['LABOR', 'MATERIALS', 'EQUIPMENT', 'SUBCONTRACTOR', 'PERMITS', 'OVERHEAD']
        const category = categories[Math.floor(Math.random() * categories.length)]
        const vendors = {
          LABOR: 'ABC Construction Workers',
          MATERIALS: 'XYZ Building Supplies',
          EQUIPMENT: 'Heavy Equipment Rentals Inc',
          SUBCONTRACTOR: 'Elite Electrical Services',
          PERMITS: 'City Government',
          OVERHEAD: 'Office Expenses',
        }

        transactions.push({
          projectId,
          amount: Math.floor(Math.random() * (projectBudget * 0.15)) + 10000,
          transactionType: 'EXPENSE',
          category,
          reason: `${category.toLowerCase()} expenses for construction`,
          vendorName: vendors[category as keyof typeof vendors],
          date,
          paymentStatus: Math.random() > 0.2 ? 'PAID' : 'PENDING',
          phase: 'CONSTRUCTION',
          invoiceNumber: `EXP-2025-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
          imageUrls: [],
        })
      }
    }
  }

  return transactions
}

async function main() {
  console.log('🌱 Starting seed...')

  // Check if seed data already exists
  const existingProjects = await prisma.project.findMany({
    where: {
      name: {
        startsWith: '[DEMO]',
      },
    },
  })

  if (existingProjects.length > 0) {
    console.log('⚠️  Seed data already exists. Run "npm run seed:clean" first to remove existing data.')
    return
  }

  // Create projects with transactions
  for (const projectData of SEED_PROJECTS) {
    console.log(`Creating project: ${projectData.name}`)
    
    const project = await prisma.project.create({
      data: projectData,
    })

    // Generate transactions for this project
    const transactions = await generateTransactions(project.id, projectData.totalBudget, projectData.status)
    
    console.log(`  Creating ${transactions.length} transactions...`)
    
    for (const transaction of transactions) {
      await prisma.transaction.create({
        data: transaction,
      })
    }
  }

  console.log('✅ Seed completed successfully!')
  console.log(`Created ${SEED_PROJECTS.length} projects with transactions for 2025`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
