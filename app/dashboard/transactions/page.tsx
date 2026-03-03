import { prisma } from "@/lib/prisma"
import { TransactionsMasterTable } from "@/components/transactions-master-table"

export const dynamic = 'force-dynamic'

async function getAllProjectsWithTransactions() {
  return await prisma.project.findMany({
    include: {
      transactions: {
        orderBy: {
          date: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export default async function TransactionsPage() {
  const projects = await getAllProjectsWithTransactions()

  return <TransactionsMasterTable projects={projects} />
}
