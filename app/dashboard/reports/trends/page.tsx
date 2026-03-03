import { prisma } from "@/lib/prisma"
import { TrendsClient } from "@/components/reports/trends-client"

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

export default async function TrendsPage() {
  const projects = await getAllProjectsWithTransactions()

  return <TrendsClient projects={projects} />
}
