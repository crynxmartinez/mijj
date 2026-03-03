import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionForm } from "@/components/transaction-form"
import { prisma } from "@/lib/prisma"

async function getProjects() {
  return await prisma.project.findMany({
    where: {
      status: {
        in: ["PRE_BIDDING", "ACTIVE"],
      },
    },
    orderBy: {
      name: "asc",
    },
  })
}

export default async function NewTransactionPage() {
  const projects = await getProjects()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add Transaction</h2>
        <p className="text-muted-foreground">
          Record a new expense or payment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            Enter the expense information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionForm projects={projects} />
        </CardContent>
      </Card>
    </div>
  )
}
