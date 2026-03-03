"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, TrendingUp, DollarSign, BarChart3, PieChart, FileSpreadsheet } from "lucide-react"

export type ReportType = "profit-loss" | "project-profitability" | "cash-flow" | "trends" | "expense-category" | "accounts-receivable" | "accounts-payable"

interface ReportSelectorProps {
  value: ReportType
  onChange: (value: ReportType) => void
}

const reportTypes = [
  { value: "profit-loss", label: "Profit & Loss Statement", icon: TrendingUp },
  { value: "project-profitability", label: "Project Profitability", icon: BarChart3 },
  { value: "cash-flow", label: "Cash Flow Statement", icon: DollarSign },
  { value: "trends", label: "Financial Trends", icon: TrendingUp },
  { value: "expense-category", label: "Expense by Category", icon: PieChart },
  { value: "accounts-receivable", label: "Accounts Receivable", icon: FileText },
  { value: "accounts-payable", label: "Accounts Payable", icon: FileSpreadsheet },
]

export function ReportSelector({ value, onChange }: ReportSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Report Type</label>
      <Select value={value} onValueChange={(v) => onChange(v as ReportType)}>
        <SelectTrigger className="w-full md:w-[400px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {reportTypes.map((report) => {
            const Icon = report.icon
            return (
              <SelectItem key={report.value} value={report.value}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {report.label}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
