"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface Transaction {
  id: string
  amount: number
  transactionType: string
  category: string
  reason: string
}

interface Project {
  id: string
  name: string
  transactions: Transaction[]
}

interface ProfitLossReportProps {
  projects: Project[]
  dateFrom: string
  dateTo: string
}

export function ProfitLossReport({ projects, dateFrom, dateTo }: ProfitLossReportProps) {
  // Calculate income by category
  const incomeByReason = new Map<string, number>()
  let totalIncome = 0

  // Calculate expenses by category
  const expensesByCategory = new Map<string, number>()
  let totalExpenses = 0

  projects.forEach(project => {
    project.transactions.forEach(t => {
      if (t.transactionType === "INCOME") {
        totalIncome += t.amount
        incomeByReason.set(t.reason, (incomeByReason.get(t.reason) || 0) + t.amount)
      } else {
        totalExpenses += t.amount
        expensesByCategory.set(t.category, (expensesByCategory.get(t.category) || 0) + t.amount)
      }
    })
  })

  const netIncome = totalIncome - totalExpenses
  const profitMargin = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0

  const formatReason = (reason: string) => {
    return reason.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  return (
    <Card>
      <CardHeader className="text-center border-b">
        <CardTitle className="text-2xl">Profit & Loss Statement</CardTitle>
        <p className="text-sm text-muted-foreground">
          {dateFrom && dateTo ? `${new Date(dateFrom).toLocaleDateString()} - ${new Date(dateTo).toLocaleDateString()}` : 'All Time'}
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* INCOME SECTION */}
          <div>
            <h3 className="font-bold text-lg mb-3">INCOME</h3>
            <div className="space-y-2 pl-4">
              {Array.from(incomeByReason.entries()).map(([reason, amount]) => (
                <div key={reason} className="flex justify-between">
                  <span className="text-muted-foreground">{formatReason(reason)}</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
              ))}
              {incomeByReason.size === 0 && (
                <p className="text-sm text-muted-foreground">No income recorded</p>
              )}
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t font-semibold">
              <span>Total Income</span>
              <span className="text-green-600">{formatCurrency(totalIncome)}</span>
            </div>
          </div>

          {/* EXPENSES SECTION */}
          <div>
            <h3 className="font-bold text-lg mb-3">EXPENSES</h3>
            <div className="space-y-2 pl-4">
              {Array.from(expensesByCategory.entries())
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="flex justify-between">
                    <span className="text-muted-foreground">{formatCategory(category)}</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                ))}
              {expensesByCategory.size === 0 && (
                <p className="text-sm text-muted-foreground">No expenses recorded</p>
              )}
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t font-semibold">
              <span>Total Expenses</span>
              <span className="text-red-600">{formatCurrency(totalExpenses)}</span>
            </div>
          </div>

          {/* NET INCOME */}
          <div className="border-t-2 border-b-2 py-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">NET INCOME</span>
              <span className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Profit Margin</span>
              <span className={`text-sm font-semibold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* SUMMARY METRICS */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Income</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Expenses</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
              <p className={`text-lg font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netIncome)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
