import { prisma } from "@/lib/prisma"
import { ReportsClient } from "@/components/reports/reports-client"

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

export default async function ReportsPage() {
  const projects = await getAllProjectsWithTransactions()

  return <ReportsClient projects={projects} />
}
