"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Plus, ExternalLink } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

interface Transaction {
  id: string
  amount: number
  phase: string
  category: string
  transactionType: string
  reason: string
  vendorName: string
  date: Date
  paymentStatus: string
  budgetedAmount?: number | null
  invoiceNumber?: string | null
  imageUrl?: string | null
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

interface ProjectDetailModalTableProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDetailModalTable({ project, open, onOpenChange }: ProjectDetailModalTableProps) {
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

  const calculatePhaseTotal = (transactions: Transaction[]) => {
    return transactions.reduce((sum, t) => {
      return sum + (t.transactionType === "INCOME" ? t.amount : -t.amount)
    }, 0)
  }

  const totalIncome = project.transactions
    .filter(t => t.transactionType === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = project.transactions
    .filter(t => t.transactionType === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)

  const currentBudget = project.totalBudget + totalIncome - totalExpenses
  const utilizationPercent = (totalExpenses / currentBudget) * 100

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

  const formatReason = (reason: string) => {
    return reason.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const PhaseSection = ({ 
    title, 
    transactions, 
    phase 
  }: { 
    title: string
    transactions: Transaction[]
    phase: string 
  }) => {
    const phaseTotal = calculatePhaseTotal(transactions)
    const isExpanded = expandedPhases.includes(phase)

    return (
      <div className="border rounded-lg">
        <button
          onClick={() => togglePhase(phase)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
            <h3 className="font-semibold">{title}</h3>
            <Badge variant="secondary">{transactions.length} items</Badge>
          </div>
          <span className={`text-sm font-medium ${phaseTotal < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {phaseTotal >= 0 ? '+' : ''}{formatCurrency(phaseTotal)}
          </span>
        </button>
        
        {isExpanded && (
          <div className="p-4 pt-0">
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Date</th>
                      <th className="text-left py-2 px-2">Name/Person</th>
                      <th className="text-right py-2 px-2">Amount</th>
                      <th className="text-left py-2 px-2">Reason</th>
                      <th className="text-left py-2 px-2">Notes</th>
                      <th className="text-center py-2 px-2">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-2 text-muted-foreground">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{transaction.vendorName}</p>
                            <Badge className={getStatusColor(transaction.paymentStatus)} variant="outline">
                              {transaction.paymentStatus}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className={`font-semibold ${transaction.transactionType === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.transactionType === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm">{formatReason(transaction.reason)}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm text-muted-foreground">
                            {transaction.notes || '-'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          {transaction.imageUrl ? (
                            <a 
                              href={transaction.imageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            >
                              📎 <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No transactions yet</p>
            )}
            <Link href={`/dashboard/transactions/new?projectId=${project.id}&phase=${phase}`}>
              <Button variant="outline" className="w-full mt-3" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </Link>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.name}</DialogTitle>
          <p className="text-muted-foreground">{project.clientName}</p>
        </DialogHeader>

        {/* Budget Summary */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Initial Budget</p>
            <p className="text-lg font-semibold">{formatCurrency(project.totalBudget)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-lg font-semibold text-green-600">+{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-semibold text-red-600">-{formatCurrency(totalExpenses)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Budget</p>
            <p className={`text-lg font-semibold ${currentBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(currentBudget)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Budget Utilization</span>
            <span className={utilizationPercent > 90 ? 'text-red-600 font-medium' : ''}>
              {utilizationPercent.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full ${utilizationPercent > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Phase Sections */}
        <div className="space-y-3">
          <PhaseSection 
            title="PRE-BIDDING" 
            transactions={preBiddingTransactions} 
            phase="PRE_BIDDING"
          />
          <PhaseSection 
            title="PROJECT START" 
            transactions={projectStartTransactions} 
            phase="PROJECT_START"
          />
          <PhaseSection 
            title="PROJECT END" 
            transactions={projectEndTransactions} 
            phase="PROJECT_END"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
