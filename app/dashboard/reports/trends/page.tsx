import { prisma } from "@/lib/prisma"
import { TrendsReport } from "@/components/reports/trends-report"

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Trends</h2>
          <p className="text-muted-foreground">Monthly income vs expenses analysis</p>
        </div>
      </div>
      <TrendsReport projects={projects} dateFrom="" dateTo="" />
    </div>
  )
}
