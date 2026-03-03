"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Transaction {
  id: string
  amount: number
  transactionType: string
}

interface Project {
  id: string
  name: string
  totalBudget: number
  status: string
  transactions: Transaction[]
}

interface ProjectProfitabilityReportProps {
  projects: Project[]
  dateFrom: string
  dateTo: string
}

export function ProjectProfitabilityReport({ projects, dateFrom, dateTo }: ProjectProfitabilityReportProps) {
  const projectStats = projects.map(project => {
    const income = project.transactions
      .filter(t => t.transactionType === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = project.transactions
      .filter(t => t.transactionType === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0)
    
    const netProfit = income - expenses
    const profitMargin = income > 0 ? (netProfit / income) * 100 : 0
    const budgetVariance = project.totalBudget - expenses
    const budgetUtilization = project.totalBudget > 0 ? (expenses / project.totalBudget) * 100 : 0

    return {
      ...project,
      income,
      expenses,
      netProfit,
      profitMargin,
      budgetVariance,
      budgetUtilization
    }
  }).sort((a, b) => b.netProfit - a.netProfit)

  const totals = projectStats.reduce((acc, p) => ({
    totalBudget: acc.totalBudget + p.totalBudget,
    income: acc.income + p.income,
    expenses: acc.expenses + p.expenses,
    netProfit: acc.netProfit + p.netProfit
  }), { totalBudget: 0, income: 0, expenses: 0, netProfit: 0 })

  const overallProfitMargin = totals.income > 0 ? (totals.netProfit / totals.income) * 100 : 0

  return (
    <Card>
      <CardHeader className="text-center border-b">
        <CardTitle className="text-2xl">Project Profitability Report</CardTitle>
        <p className="text-sm text-muted-foreground">
          {dateFrom && dateTo ? `${new Date(dateFrom).toLocaleDateString()} - ${new Date(dateTo).toLocaleDateString()}` : 'All Time'}
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
            <p className="text-lg font-bold">{formatCurrency(totals.totalBudget)}</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Income</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(totals.income)}</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Expenses</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(totals.expenses)}</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
            <p className={`text-lg font-bold ${totals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totals.netProfit)}
            </p>
          </div>
        </div>

        {/* Project Details Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-semibold">Project</th>
                <th className="text-right py-3 px-2 font-semibold">Budget</th>
                <th className="text-right py-3 px-2 font-semibold">Income</th>
                <th className="text-right py-3 px-2 font-semibold">Expenses</th>
                <th className="text-right py-3 px-2 font-semibold">Net Profit</th>
                <th className="text-right py-3 px-2 font-semibold">Margin</th>
                <th className="text-right py-3 px-2 font-semibold">Budget Used</th>
                <th className="text-center py-3 px-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {projectStats.map(project => (
                <tr key={project.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2 font-medium">{project.name}</td>
                  <td className="py-3 px-2 text-right">{formatCurrency(project.totalBudget)}</td>
                  <td className="py-3 px-2 text-right text-green-600">{formatCurrency(project.income)}</td>
                  <td className="py-3 px-2 text-right text-red-600">{formatCurrency(project.expenses)}</td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {project.netProfit >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`font-semibold ${project.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(project.netProfit)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className={`font-semibold ${project.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {project.profitMargin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${project.budgetUtilization > 100 ? 'bg-red-500' : project.budgetUtilization > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(project.budgetUtilization, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm">{project.budgetUtilization.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Badge variant={
                      project.status === "ACTIVE" ? "default" :
                      project.status === "COMPLETED" ? "secondary" : "outline"
                    }>
                      {project.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-bold">
                <td className="py-3 px-2">TOTAL</td>
                <td className="py-3 px-2 text-right">{formatCurrency(totals.totalBudget)}</td>
                <td className="py-3 px-2 text-right text-green-600">{formatCurrency(totals.income)}</td>
                <td className="py-3 px-2 text-right text-red-600">{formatCurrency(totals.expenses)}</td>
                <td className="py-3 px-2 text-right">
                  <span className={totals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(totals.netProfit)}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className={overallProfitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {overallProfitMargin.toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-2"></td>
                <td className="py-3 px-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {projectStats.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No projects found for the selected period
          </div>
        )}
      </CardContent>
    </Card>
  )
}
