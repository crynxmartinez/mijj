"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Plus, Calendar, User, DollarSign, FileText } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

interface Transaction {
  id: string
  amount: number
  phase: string
  category: string
  vendorName: string
  date: Date
  paymentStatus: string
  budgetedAmount?: number | null
  invoiceNumber?: string | null
  notes?: string | null
}

interface Project {
  id: string
  name: string
  clientName: string
  totalBudget: number
  status: string
  startDate: Date
  description?: string | null
  transactions: Transaction[]
}

interface ProjectDetailModalProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDetailModal({ project, open, onOpenChange }: ProjectDetailModalProps) {
  const currentPhase = project.status === "PRE_BIDDING" ? "PRE_BIDDING" : 
                       project.status === "ACTIVE" ? "PROJECT_START" : "PROJECT_END"
  
  const [expandedPhases, setExpandedPhases] = useState<string[]>([currentPhase])

  const togglePhase = (phase: string) => {
    setExpandedPhases(prev => 
      prev.includes(phase) 
        ? prev.filter(p => p !== phase)
        : [...prev, phase]
    )
  }

  const getTransactionsByPhase = (phase: string) => {
    if (phase === "PROJECT_END") {
      return project.transactions.filter(t => 
        t.phase === "COMPLETION" || t.phase === "POST_PROJECT"
      )
    }
    return project.transactions.filter(t => t.phase === phase)
  }

  const preBiddingTransactions = getTransactionsByPhase("PRE_BIDDING")
  const projectStartTransactions = getTransactionsByPhase("PROJECT_START")
  const projectEndTransactions = getTransactionsByPhase("PROJECT_END")

  const getPhaseTotal = (transactions: Transaction[]) => {
    return transactions.reduce((sum, t) => sum + t.amount, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "OVERDUE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "LABOR":
        return "👷"
      case "MATERIALS":
        return "📦"
      case "EQUIPMENT":
        return "🔧"
      case "SUBCONTRACTOR":
        return "🏗️"
      case "PERMITS":
        return "📋"
      case "OVERHEAD":
        return "💼"
      default:
        return "📄"
    }
  }

  const totalSpent = project.transactions.reduce((sum, t) => sum + t.amount, 0)
  const remaining = project.totalBudget - totalSpent

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.name}</DialogTitle>
          <p className="text-muted-foreground">{project.clientName}</p>
        </DialogHeader>

        {/* Project Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-lg font-semibold">{formatCurrency(project.totalBudget)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-lg font-semibold">{formatCurrency(totalSpent)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className={`text-lg font-semibold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>

        {/* Phase Sections */}
        <div className="space-y-3">
          {/* Pre-Bidding Phase */}
          <div className="border rounded-lg">
            <button
              onClick={() => togglePhase("PRE_BIDDING")}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                {expandedPhases.includes("PRE_BIDDING") ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <h3 className="font-semibold">PRE-BIDDING</h3>
                <Badge variant="secondary">{preBiddingTransactions.length} items</Badge>
              </div>
              <span className="text-sm font-medium">{formatCurrency(getPhaseTotal(preBiddingTransactions))}</span>
            </button>
            
            {expandedPhases.includes("PRE_BIDDING") && (
              <div className="p-4 pt-0 space-y-2">
                {preBiddingTransactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-3 hover:bg-slate-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCategoryIcon(transaction.category)}</span>
                        <div>
                          <p className="font-medium">{transaction.category.replace("_", " ")}</p>
                          <p className="text-sm text-muted-foreground">{transaction.vendorName}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(transaction.paymentStatus)}>
                        {transaction.paymentStatus}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(transaction.date)}
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                    {transaction.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{transaction.notes}</p>
                    )}
                  </div>
                ))}
                <Link href={`/dashboard/transactions/new?projectId=${project.id}&phase=PRE_BIDDING`}>
                  <Button variant="outline" className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add more item
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Project Start Phase */}
          <div className="border rounded-lg">
            <button
              onClick={() => togglePhase("PROJECT_START")}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                {expandedPhases.includes("PROJECT_START") ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <h3 className="font-semibold">PROJECT START</h3>
                <Badge variant="secondary">{projectStartTransactions.length} items</Badge>
              </div>
              <span className="text-sm font-medium">{formatCurrency(getPhaseTotal(projectStartTransactions))}</span>
            </button>
            
            {expandedPhases.includes("PROJECT_START") && (
              <div className="p-4 pt-0 space-y-2">
                {projectStartTransactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-3 hover:bg-slate-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCategoryIcon(transaction.category)}</span>
                        <div>
                          <p className="font-medium">{transaction.category.replace("_", " ")}</p>
                          <p className="text-sm text-muted-foreground">{transaction.vendorName}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(transaction.paymentStatus)}>
                        {transaction.paymentStatus}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(transaction.date)}
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                    {transaction.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{transaction.notes}</p>
                    )}
                  </div>
                ))}
                <Link href={`/dashboard/transactions/new?projectId=${project.id}&phase=PROJECT_START`}>
                  <Button variant="outline" className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add more item
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Project End Phase */}
          <div className="border rounded-lg">
            <button
              onClick={() => togglePhase("PROJECT_END")}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                {expandedPhases.includes("PROJECT_END") ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <h3 className="font-semibold">PROJECT END</h3>
                <Badge variant="secondary">{projectEndTransactions.length} items</Badge>
              </div>
              <span className="text-sm font-medium">{formatCurrency(getPhaseTotal(projectEndTransactions))}</span>
            </button>
            
            {expandedPhases.includes("PROJECT_END") && (
              <div className="p-4 pt-0 space-y-2">
                {projectEndTransactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-3 hover:bg-slate-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCategoryIcon(transaction.category)}</span>
                        <div>
                          <p className="font-medium">{transaction.category.replace("_", " ")}</p>
                          <p className="text-sm text-muted-foreground">{transaction.vendorName}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(transaction.paymentStatus)}>
                        {transaction.paymentStatus}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(transaction.date)}
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                    {transaction.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{transaction.notes}</p>
                    )}
                  </div>
                ))}
                <Link href={`/dashboard/transactions/new?projectId=${project.id}&phase=COMPLETION`}>
                  <Button variant="outline" className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add more item
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
