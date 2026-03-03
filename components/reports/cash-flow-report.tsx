"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"

interface Transaction {
  id: string
  amount: number
  transactionType: string
  paymentStatus: string
  date: Date
}

interface Project {
  id: string
  name: string
  transactions: Transaction[]
}

interface CashFlowReportProps {
  projects: Project[]
  dateFrom: string
  dateTo: string
}

export function CashFlowReport({ projects, dateFrom, dateTo }: CashFlowReportProps) {
  // Cash Inflows (Income that's been PAID)
  const cashInflows = projects.reduce((total, project) => {
    return total + project.transactions
      .filter(t => t.transactionType === "INCOME" && t.paymentStatus === "PAID")
      .reduce((sum, t) => sum + t.amount, 0)
  }, 0)

  // Cash Outflows (Expenses that's been PAID)
  const cashOutflows = projects.reduce((total, project) => {
    return total + project.transactions
      .filter(t => t.transactionType === "EXPENSE" && t.paymentStatus === "PAID")
      .reduce((sum, t) => sum + t.amount, 0)
  }, 0)

  // Pending Inflows (Income PENDING/OVERDUE)
  const pendingInflows = projects.reduce((total, project) => {
    return total + project.transactions
      .filter(t => t.transactionType === "INCOME" && t.paymentStatus !== "PAID")
      .reduce((sum, t) => sum + t.amount, 0)
  }, 0)

  // Pending Outflows (Expenses PENDING/OVERDUE)
  const pendingOutflows = projects.reduce((total, project) => {
    return total + project.transactions
      .filter(t => t.transactionType === "EXPENSE" && t.paymentStatus !== "PAID")
      .reduce((sum, t) => sum + t.amount, 0)
  }, 0)

  const netCashFlow = cashInflows - cashOutflows
  const projectedCashFlow = (cashInflows + pendingInflows) - (cashOutflows + pendingOutflows)

  return (
    <Card>
      <CardHeader className="text-center border-b">
        <CardTitle className="text-2xl">Cash Flow Statement</CardTitle>
        <p className="text-sm text-muted-foreground">
          {dateFrom && dateTo ? `${new Date(dateFrom).toLocaleDateString()} - ${new Date(dateTo).toLocaleDateString()}` : 'All Time'}
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* CASH INFLOWS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-bold text-lg">CASH INFLOWS</h3>
            </div>
            <div className="space-y-2 pl-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payments Received (Paid)</span>
                <span className="font-medium text-green-600">{formatCurrency(cashInflows)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending Receipts</span>
                <span className="font-medium text-yellow-600">{formatCurrency(pendingInflows)}</span>
              </div>
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t font-semibold">
              <span>Total Cash Inflows</span>
              <span className="text-green-600">{formatCurrency(cashInflows)}</span>
            </div>
          </div>

          {/* CASH OUTFLOWS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowDownCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-bold text-lg">CASH OUTFLOWS</h3>
            </div>
            <div className="space-y-2 pl-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payments Made (Paid)</span>
                <span className="font-medium text-red-600">{formatCurrency(cashOutflows)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending Payments</span>
                <span className="font-medium text-yellow-600">{formatCurrency(pendingOutflows)}</span>
              </div>
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t font-semibold">
              <span>Total Cash Outflows</span>
              <span className="text-red-600">{formatCurrency(cashOutflows)}</span>
            </div>
          </div>

          {/* NET CASH FLOW */}
          <div className="border-t-2 border-b-2 py-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">NET CASH FLOW</span>
              <span className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netCashFlow)}
              </span>
            </div>
          </div>

          {/* PROJECTED CASH FLOW */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Projected Cash Flow (Including Pending)</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Expected Inflows</span>
                <span className="font-medium text-green-600">{formatCurrency(cashInflows + pendingInflows)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Expected Outflows</span>
                <span className="font-medium text-red-600">{formatCurrency(cashOutflows + pendingOutflows)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold">
                <span>Projected Net Cash Flow</span>
                <span className={projectedCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(projectedCashFlow)}
                </span>
              </div>
            </div>
          </div>

          {/* SUMMARY METRICS */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <ArrowUpCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Cash In</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(cashInflows)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                +{formatCurrency(pendingInflows)} pending
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <ArrowDownCircle className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Cash Out</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(cashOutflows)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                +{formatCurrency(pendingOutflows)} pending
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
