"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Transaction {
  id: string
  amount: number
  transactionType: string
  date: Date
}

interface Project {
  id: string
  name: string
  transactions: Transaction[]
}

interface TrendsReportProps {
  projects: Project[]
  selectedYear: number
}

interface MonthlyData {
  month: string
  monthNum: number
  income: number
  expenses: number
  net: number
}

export function TrendsReport({ projects, selectedYear }: TrendsReportProps) {
  // Initialize 12 months
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Calculate monthly data for selected year
  const monthlyData: MonthlyData[] = months.map((month, index) => {
    let income = 0
    let expenses = 0

    projects.forEach(project => {
      project.transactions.forEach(t => {
        const transactionDate = new Date(t.date)
        const transactionMonth = transactionDate.getMonth()
        const transactionYear = transactionDate.getFullYear()

        // Only include transactions from selected year and matching month
        if (transactionYear === selectedYear && transactionMonth === index) {
          if (t.transactionType === "INCOME") {
            income += t.amount
          } else {
            expenses += t.amount
          }
        }
      })
    })

    return {
      month,
      monthNum: index + 1,
      income,
      expenses,
      net: income - expenses
    }
  })

  // Calculate totals
  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0)
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0)
  const totalNet = totalIncome - totalExpenses

  // Find best and worst months
  const bestMonth = monthlyData.reduce((best, current) => 
    current.net > best.net ? current : best
  )
  const worstMonth = monthlyData.reduce((worst, current) => 
    current.net < worst.net ? current : worst
  )

  // Calculate max value for chart scaling
  const maxValue = Math.max(
    ...monthlyData.map(m => Math.max(m.income, m.expenses))
  )

  return (
    <Card>
      <CardHeader className="text-center border-b">
        <CardTitle className="text-2xl">Financial Trends - {selectedYear}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly Income vs Expenses
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Income</p>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Expenses</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className={`text-center p-4 border rounded-lg ${totalNet >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <p className="text-xs text-muted-foreground mb-1">Net Profit/Loss</p>
            <p className={`text-lg font-bold ${totalNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalNet)}
            </p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Avg Monthly Income</p>
            <p className="text-lg font-bold">{formatCurrency(totalIncome / 12)}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-8">
          <div className="flex items-end justify-between gap-2 h-64 border-b border-l border-muted pb-2 pl-2">
            {monthlyData.map((data, index) => {
              const incomeHeight = maxValue > 0 ? (data.income / maxValue) * 100 : 0
              const expenseHeight = maxValue > 0 ? (data.expenses / maxValue) * 100 : 0

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  {/* Income Bar */}
                  <div className="w-full flex justify-center items-end h-full">
                    <div className="flex gap-1 items-end h-full w-full max-w-[80px]">
                      <div
                        className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer relative group"
                        style={{ height: `${incomeHeight}%` }}
                        title={`Income: ${formatCurrency(data.income)}`}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {formatCurrency(data.income)}
                        </div>
                      </div>
                      {/* Expense Bar */}
                      <div
                        className="flex-1 bg-red-500 rounded-t hover:bg-red-600 transition-all cursor-pointer relative group"
                        style={{ height: `${expenseHeight}%` }}
                        title={`Expenses: ${formatCurrency(data.expenses)}`}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {formatCurrency(data.expenses)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Month Label */}
                  <span className="text-xs text-muted-foreground mt-2">
                    {data.month.substring(0, 3)}
                  </span>
                </div>
              )
            })}
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Expenses</span>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-semibold">Month</th>
                <th className="text-right py-3 px-2 font-semibold">Income</th>
                <th className="text-right py-3 px-2 font-semibold">Expenses</th>
                <th className="text-right py-3 px-2 font-semibold">Net</th>
                <th className="text-center py-3 px-2 font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2 font-medium">{data.month}</td>
                  <td className="py-3 px-2 text-right text-blue-600 font-semibold">
                    {formatCurrency(data.income)}
                  </td>
                  <td className="py-3 px-2 text-right text-red-600 font-semibold">
                    {formatCurrency(data.expenses)}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className={`font-semibold ${data.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.net)}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    {data.net >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600 inline" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600 inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-bold">
                <td className="py-3 px-2">TOTAL</td>
                <td className="py-3 px-2 text-right text-blue-600">{formatCurrency(totalIncome)}</td>
                <td className="py-3 px-2 text-right text-red-600">{formatCurrency(totalExpenses)}</td>
                <td className="py-3 px-2 text-right">
                  <span className={totalNet >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(totalNet)}
                  </span>
                </td>
                <td className="py-3 px-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Best Month</h4>
            </div>
            <p className="text-sm text-green-800">
              <span className="font-bold">{bestMonth.month}</span> with net profit of{' '}
              <span className="font-bold">{formatCurrency(bestMonth.net)}</span>
            </p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <h4 className="font-semibold text-red-900">Worst Month</h4>
            </div>
            <p className="text-sm text-red-800">
              <span className="font-bold">{worstMonth.month}</span> with net{' '}
              {worstMonth.net >= 0 ? 'profit' : 'loss'} of{' '}
              <span className="font-bold">{formatCurrency(Math.abs(worstMonth.net))}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
