"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Printer, Download } from "lucide-react"
import { ReportSelector, ReportType } from "@/components/reports/report-selector"
import { ProfitLossReport } from "@/components/reports/profit-loss-report"
import { ProjectProfitabilityReport } from "@/components/reports/project-profitability-report"
import { CashFlowReport } from "@/components/reports/cash-flow-report"
import { TrendsReport } from "@/components/reports/trends-report"

interface Transaction {
  id: string
  amount: number
  transactionType: string
  category: string
  reason: string
  paymentStatus: string
  date: Date
}

interface Project {
  id: string
  name: string
  totalBudget: number
  status: string
  transactions: Transaction[]
}

interface ReportsClientProps {
  projects: Project[]
}

export function ReportsClient({ projects }: ReportsClientProps) {
  const [reportType, setReportType] = useState<ReportType>("profit-loss")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedProject, setSelectedProject] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  // Filter projects by date and project selection
  const filteredProjects = projects.map(project => {
    let filteredTransactions = project.transactions

    // Filter by date
    if (dateFrom) {
      filteredTransactions = filteredTransactions.filter(
        t => new Date(t.date) >= new Date(dateFrom)
      )
    }
    if (dateTo) {
      filteredTransactions = filteredTransactions.filter(
        t => new Date(t.date) <= new Date(dateTo)
      )
    }

    return {
      ...project,
      transactions: filteredTransactions
    }
  }).filter(p => {
    // Filter by project selection
    if (selectedProject === "all") return true
    return p.id === selectedProject
  })

  const handleDateRangeChange = (value: string) => {
    setDateRange(value)
    const today = new Date()
    
    switch (value) {
      case "today":
        setDateFrom(today.toISOString().split('T')[0])
        setDateTo(today.toISOString().split('T')[0])
        break
      case "this-week":
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
        setDateFrom(weekStart.toISOString().split('T')[0])
        setDateTo(new Date().toISOString().split('T')[0])
        break
      case "this-month":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        setDateFrom(monthStart.toISOString().split('T')[0])
        setDateTo(new Date().toISOString().split('T')[0])
        break
      case "this-quarter":
        const quarter = Math.floor(today.getMonth() / 3)
        const quarterStart = new Date(today.getFullYear(), quarter * 3, 1)
        setDateFrom(quarterStart.toISOString().split('T')[0])
        setDateTo(new Date().toISOString().split('T')[0])
        break
      case "this-year":
        const yearStart = new Date(today.getFullYear(), 0, 1)
        setDateFrom(yearStart.toISOString().split('T')[0])
        setDateTo(new Date().toISOString().split('T')[0])
        break
      case "all":
        setDateFrom("")
        setDateTo("")
        break
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    // TODO: Implement CSV/PDF export
    alert("Export functionality coming soon!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Project Reports</h2>
          <p className="text-muted-foreground">QuickBooks-style financial reporting for construction projects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="print:hidden">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ReportSelector value={reportType} onChange={setReportType} />
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value)
                  setDateRange("custom")
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value)
                  setDateRange("custom")
                }}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="space-y-2">
              <Label>Filter by Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Display */}
      <div className="print:mt-0">
        {reportType === "profit-loss" && (
          <ProfitLossReport 
            projects={filteredProjects} 
            dateFrom={dateFrom} 
            dateTo={dateTo} 
          />
        )}
        {reportType === "project-profitability" && (
          <ProjectProfitabilityReport 
            projects={filteredProjects} 
            dateFrom={dateFrom} 
            dateTo={dateTo} 
          />
        )}
        {reportType === "cash-flow" && (
          <CashFlowReport 
            projects={filteredProjects} 
            dateFrom={dateFrom} 
            dateTo={dateTo} 
          />
        )}
        {reportType === "trends" && (
          <TrendsReport 
            projects={filteredProjects} 
            dateFrom={dateFrom} 
            dateTo={dateTo} 
          />
        )}
        {(reportType === "expense-category" || 
          reportType === "accounts-receivable" || 
          reportType === "accounts-payable") && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              This report type is coming soon!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
