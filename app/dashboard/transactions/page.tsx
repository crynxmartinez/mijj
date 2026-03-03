import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { Plus } from "lucide-react"

async function getTransactions() {
  return await prisma.transaction.findMany({
    include: {
      project: true,
    },
    orderBy: {
      date: "desc",
    },
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "default"
    case "PENDING":
      return "secondary"
    case "OVERDUE":
      return "destructive"
    default:
      return "outline"
  }
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    LABOR: "bg-blue-100 text-blue-800",
    MATERIALS: "bg-green-100 text-green-800",
    EQUIPMENT: "bg-yellow-100 text-yellow-800",
    SUBCONTRACTOR: "bg-purple-100 text-purple-800",
    PERMITS: "bg-red-100 text-red-800",
    OVERHEAD: "bg-gray-100 text-gray-800",
  }
  return colors[category] || "bg-gray-100 text-gray-800"
}

export default async function TransactionsPage() {
  const transactions = await getTransactions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            Track all project expenses and payments
          </p>
        </div>
        <Link href="/dashboard/transactions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Complete list of project expenses</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">No transactions yet</p>
              <Link href="/transactions/new">
                <Button>Add Your First Transaction</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{transaction.vendorName}</p>
                      <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(transaction.category)}`}>
                        {transaction.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.project.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <span>{transaction.phase.replace("_", " ")}</span>
                    </div>
                    {transaction.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{transaction.notes}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold">{formatCurrency(transaction.amount)}</p>
                    <Badge variant={getStatusColor(transaction.paymentStatus)} className="mt-1">
                      {transaction.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
