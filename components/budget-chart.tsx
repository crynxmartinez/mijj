"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/lib/utils"

interface Project {
  id: string
  name: string
  totalBudget: number
  transactions: { amount: number }[]
}

export function BudgetChart({ projects }: { projects: Project[] }) {
  const data = projects.slice(0, 5).map(project => {
    const spent = project.transactions.reduce((sum, t) => sum + t.amount, 0)
    return {
      name: project.name.length > 15 ? project.name.substring(0, 15) + "..." : project.name,
      Budget: project.totalBudget,
      Spent: spent,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Spending</CardTitle>
        <CardDescription>Top 5 projects by budget</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Bar dataKey="Budget" fill="hsl(var(--primary))" />
            <Bar dataKey="Spent" fill="hsl(var(--destructive))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
