"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TrendsReport } from "@/components/reports/trends-report"

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

interface TrendsClientProps {
  projects: Project[]
}

export function TrendsClient({ projects }: TrendsClientProps) {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  
  // Generate year options (current year and past 5 years)
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Trends</h2>
          <p className="text-muted-foreground">Monthly income vs expenses analysis</p>
        </div>
      </div>

      {/* Year Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="year-select" className="text-sm font-medium">
              Filter by Year
            </Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="year-select" className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trends Report */}
      <TrendsReport projects={projects} selectedYear={parseInt(selectedYear)} />
    </div>
  )
}
