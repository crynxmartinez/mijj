import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDate } from "@/lib/utils"

export async function RecentTransactions() {
  const transactions = await prisma.transaction.findMany({
    include: {
      project: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 10,
  })

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest financial activities across all projects</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{transaction.vendorName}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{transaction.project.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(transaction.amount)}</p>
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
  )
}
