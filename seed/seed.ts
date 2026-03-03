import { PrismaClient, ProjectStatus, TransactionType, TransactionCategory, TransactionReason, PaymentStatus, ProjectPhase } from '@prisma/client'

const prisma = new PrismaClient()

const SEED_PROJECTS = [
  {
    name: '[DEMO] Residential Building - Makati',
    description: 'Modern 5-story residential building with commercial ground floor',
    clientName: 'ABC Development Corp',
    totalBudget: 5000000,
    status: ProjectStatus.ACTIVE,
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 11, 31),
  },
  {
    name: '[DEMO] Office Renovation - BGC',
    description: 'Complete office space renovation including electrical and HVAC',
    clientName: 'XYZ Holdings Inc',
    totalBudget: 2500000,
    status: ProjectStatus.ACTIVE,
    startDate: new Date(2025, 1, 1),
    endDate: new Date(2025, 8, 30),
  },
  {
    name: '[DEMO] Warehouse Construction - Laguna',
    description: 'Industrial warehouse with loading docks and office area',
    clientName: 'Logistics Solutions Ltd',
    totalBudget: 3500000,
    status: ProjectStatus.PRE_BIDDING,
    startDate: new Date(2025, 2, 1),
    endDate: new Date(2025, 10, 30),
  },
  {
    name: '[DEMO] School Building Repair - Quezon City',
    description: 'Structural repairs and painting of 3-story school building',
    clientName: 'Department of Education',
    totalBudget: 1500000,
    status: ProjectStatus.COMPLETED,
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 9, 31),
  },
  {
    name: '[DEMO] Shopping Mall Expansion - Pasig',
    description: 'New wing addition with retail spaces and parking',
    clientName: 'Mega Mall Properties',
    totalBudget: 8000000,
    status: ProjectStatus.ON_HOLD,
    startDate: new Date(2025, 3, 1),
    endDate: new Date(2026, 2, 31),
  },
  {
    name: '[DEMO] Condominium Tower - Manila',
    description: '25-story residential condominium with amenities',
    clientName: 'Prime Realty Corp',
    totalBudget: 15000000,
    status: ProjectStatus.ACTIVE,
    startDate: new Date(2025, 0, 15),
    endDate: new Date(2026, 11, 31),
  },
  {
    name: '[DEMO] Bridge Repair - Cavite',
    description: 'Structural reinforcement and resurfacing of highway bridge',
    clientName: 'DPWH',
    totalBudget: 4500000,
    status: ProjectStatus.COMPLETED,
    startDate: new Date(2025, 1, 1),
    endDate: new Date(2025, 7, 31),
  },
  {
    name: '[DEMO] Hotel Renovation - Cebu',
    description: 'Complete interior renovation of 5-star hotel',
    clientName: 'Luxury Hotels Inc',
    totalBudget: 6000000,
    status: ProjectStatus.ACTIVE,
    startDate: new Date(2025, 2, 1),
    endDate: new Date(2025, 10, 30),
  },
  {
    name: '[DEMO] Factory Expansion - Batangas',
    description: 'Manufacturing facility expansion with new production lines',
    clientName: 'Industrial Manufacturing Co',
    totalBudget: 10000000,
    status: ProjectStatus.ACTIVE,
    startDate: new Date(2025, 1, 15),
    endDate: new Date(2025, 11, 15),
  },
  {
    name: '[DEMO] Church Restoration - Pampanga',
    description: 'Historical church restoration and preservation',
    clientName: 'Archdiocese of Pampanga',
    totalBudget: 2000000,
    status: ProjectStatus.PRE_BIDDING,
    startDate: new Date(2025, 4, 1),
    endDate: new Date(2025, 11, 31),
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
          transactionType: TransactionType.INCOME,
          category: TransactionCategory.OTHER,
          reason: TransactionReason.CLIENT_PAYMENT,
          vendorName: 'Client',
          date,
          paymentStatus: Math.random() > 0.3 ? PaymentStatus.PAID : PaymentStatus.PENDING,
          phase: ProjectPhase.IN_PROGRESS,
          invoiceNumber: `INV-2025-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
          imageUrls: [],
        })
      } else {
        // Expense transaction
        const categories = [
          TransactionCategory.LABOR,
          TransactionCategory.MATERIALS,
          TransactionCategory.EQUIPMENT,
          TransactionCategory.SUBCONTRACTOR,
          TransactionCategory.PERMITS,
          TransactionCategory.OVERHEAD,
        ]
        const category = categories[Math.floor(Math.random() * categories.length)]
        const vendors = {
          [TransactionCategory.LABOR]: 'ABC Construction Workers',
          [TransactionCategory.MATERIALS]: 'XYZ Building Supplies',
          [TransactionCategory.EQUIPMENT]: 'Heavy Equipment Rentals Inc',
          [TransactionCategory.SUBCONTRACTOR]: 'Elite Electrical Services',
          [TransactionCategory.PERMITS]: 'City Government',
          [TransactionCategory.OVERHEAD]: 'Office Expenses',
        }

        const categoryReasonMap = {
          [TransactionCategory.LABOR]: TransactionReason.LABOR_COSTS,
          [TransactionCategory.MATERIALS]: TransactionReason.MATERIALS_PURCHASE,
          [TransactionCategory.EQUIPMENT]: TransactionReason.EQUIPMENT_RENTAL,
          [TransactionCategory.SUBCONTRACTOR]: TransactionReason.SUBCONTRACTOR_PAYMENT,
          [TransactionCategory.PERMITS]: TransactionReason.PERMITS_LICENSES,
          [TransactionCategory.OVERHEAD]: TransactionReason.OVERHEAD_COSTS,
        }

        transactions.push({
          projectId,
          amount: Math.floor(Math.random() * (projectBudget * 0.15)) + 10000,
          transactionType: TransactionType.EXPENSE,
          category,
          reason: categoryReasonMap[category],
          vendorName: vendors[category],
          date,
          paymentStatus: Math.random() > 0.2 ? PaymentStatus.PAID : PaymentStatus.PENDING,
          phase: ProjectPhase.IN_PROGRESS,
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
