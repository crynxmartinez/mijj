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
          <div className="relative h-64 border-b border-l border-muted">
            {/* Y-axis grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full border-t border-muted/30" />
              ))}
            </div>

            {/* SVG for lines */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {/* Income line */}
              <polyline
                points={monthlyData.map((data, index) => {
                  const x = ((index + 0.5) / 12) * 100
                  const y = maxValue > 0 ? 100 - ((data.income / maxValue) * 100) : 100
                  return `${x}%,${y}%`
                }).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                className="drop-shadow-md"
              />
              
              {/* Expense line */}
              <polyline
                points={monthlyData.map((data, index) => {
                  const x = ((index + 0.5) / 12) * 100
                  const y = maxValue > 0 ? 100 - ((data.expenses / maxValue) * 100) : 100
                  return `${x}%,${y}%`
                }).join(' ')}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                className="drop-shadow-md"
              />
            </svg>

            {/* Data points */}
            <div className="absolute inset-0">
              {monthlyData.map((data, index) => {
                const xPos = ((index + 0.5) / 12) * 100
                const incomeY = maxValue > 0 ? 100 - ((data.income / maxValue) * 100) : 100
                const expenseY = maxValue > 0 ? 100 - ((data.expenses / maxValue) * 100) : 100

                return (
                  <div key={index}>
                    {/* Income point */}
                    <div
                      className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white cursor-pointer hover:scale-150 transition-transform group"
                      style={{ left: `${xPos}%`, top: `${incomeY}%`, transform: 'translate(-50%, -50%)' }}
                      title={`Income: ${formatCurrency(data.income)}`}
                    >
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {formatCurrency(data.income)}
                      </div>
                    </div>
                    
                    {/* Expense point */}
                    <div
                      className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white cursor-pointer hover:scale-150 transition-transform group"
                      style={{ left: `${xPos}%`, top: `${expenseY}%`, transform: 'translate(-50%, -50%)' }}
                      title={`Expenses: ${formatCurrency(data.expenses)}`}
                    >
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {formatCurrency(data.expenses)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Month labels */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2">
              {monthlyData.map((data, index) => (
                <span key={index} className="text-xs text-muted-foreground">
                  {data.month.substring(0, 3)}
                </span>
              ))}
            </div>
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
