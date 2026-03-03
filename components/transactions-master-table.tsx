"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, ExternalLink, Search, Filter, Download } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Transaction {
  id: string
  date: Date
  phase: string
  category: string
  transactionType: string
  reason: string
  vendorName: string
  amount: number
  paymentStatus: string
  invoiceNumber?: string | null
  imageUrls: string[]
  notes?: string | null
}

interface Project {
  id: string
  name: string
  totalBudget: number
  status: string
  transactions: Transaction[]
}

interface TransactionsMasterTableProps {
  projects: Project[]
}

export function TransactionsMasterTable({ projects }: TransactionsMasterTableProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set(projects.map(p => p.id))
  )
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  const toggleAll = () => {
    if (expandedProjects.size === projects.length) {
      setExpandedProjects(new Set())
    } else {
      setExpandedProjects(new Set(projects.map(p => p.id)))
    }
  }

  // Filter transactions
  const filteredProjects = useMemo(() => {
    return projects.map(project => {
      const filteredTransactions = project.transactions.filter(t => {
        // Date filter
        if (dateFrom && new Date(t.date) < new Date(dateFrom)) return false
        if (dateTo && new Date(t.date) > new Date(dateTo)) return false
        
        // Type filter
        if (typeFilter !== "ALL" && t.transactionType !== typeFilter) return false
        
        // Status filter
        if (statusFilter !== "ALL" && t.paymentStatus !== statusFilter) return false
        
        // Category filter
        if (categoryFilter !== "ALL" && t.category !== categoryFilter) return false
        
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            t.vendorName.toLowerCase().includes(query) ||
            (t.notes?.toLowerCase().includes(query)) ||
            (t.invoiceNumber?.toLowerCase().includes(query))
          )
        }
        
        return true
      })
      
      return {
        ...project,
        transactions: filteredTransactions
      }
    }).filter(p => p.transactions.length > 0)
  }, [projects, dateFrom, dateTo, typeFilter, statusFilter, categoryFilter, searchQuery])

  // Calculate summary
  const summary = useMemo(() => {
    let totalTransactions = 0
    let totalIncome = 0
    let totalExpenses = 0

    filteredProjects.forEach(project => {
      project.transactions.forEach(t => {
        totalTransactions++
        if (t.transactionType === "INCOME") {
          totalIncome += t.amount
        } else {
          totalExpenses += t.amount
        }
      })
    })

    return {
      totalTransactions,
      totalIncome,
      totalExpenses,
      net: totalIncome - totalExpenses
    }
  }, [filteredProjects])

  // Flatten transactions for pagination
  const allTransactions = useMemo(() => {
    const transactions: Array<{ project: Project; transaction: Transaction }> = []
    filteredProjects.forEach(project => {
      project.transactions.forEach(transaction => {
        transactions.push({ project, transaction })
      })
    })
    return transactions
  }, [filteredProjects])

  const totalPages = Math.ceil(allTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTransactions = allTransactions.slice(startIndex, endIndex)

  // Group paginated transactions by project
  const groupedTransactions = useMemo(() => {
    const grouped = new Map<string, Array<Transaction>>()
    paginatedTransactions.forEach(({ project, transaction }) => {
      if (!grouped.has(project.id)) {
        grouped.set(project.id, [])
      }
      grouped.get(project.id)!.push(transaction)
    })
    return grouped
  }, [paginatedTransactions])

  const clearFilters = () => {
    setDateFrom("")
    setDateTo("")
    setTypeFilter("ALL")
    setStatusFilter("ALL")
    setCategoryFilter("ALL")
    setSearchQuery("")
    setCurrentPage(1)
  }

  const formatReason = (reason: string) => {
    return reason.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">All Transactions</h2>
          <p className="text-muted-foreground">View and filter all project transactions</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Date From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Date To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="LABOR">Labor</SelectItem>
                  <SelectItem value="MATERIALS">Materials</SelectItem>
                  <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                  <SelectItem value="SUBCONTRACTOR">Subcontractor</SelectItem>
                  <SelectItem value="PERMITS">Permits</SelectItem>
                  <SelectItem value="OVERHEAD">Overhead</SelectItem>
                  <SelectItem value="CHANGE_ORDER">Change Order</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendor, notes, invoice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={clearFilters}>Clear</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold">{summary.totalTransactions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Amount</p>
              <p className={`text-2xl font-bold ${summary.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.net)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Label>Items per page:</Label>
          <Select value={itemsPerPage.toString()} onValueChange={(v) => {
            setItemsPerPage(parseInt(v))
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAll}
          >
            {expandedProjects.size === projects.length ? "Collapse All" : "Expand All"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, allTransactions.length)} of {allTransactions.length}
          </p>
        </div>
      </div>

      {/* Transactions by Project */}
      <div className="space-y-4">
        {filteredProjects.map(project => {
          const projectTransactions = groupedTransactions.get(project.id) || []
          if (projectTransactions.length === 0) return null

          const isExpanded = expandedProjects.has(project.id)

          return (
            <Card key={project.id}>
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleProject(project.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                    <CardTitle>{project.name}</CardTitle>
                    <Badge variant={
                      project.status === "ACTIVE" ? "default" :
                      project.status === "COMPLETED" ? "secondary" : "outline"
                    }>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Budget: {formatCurrency(project.totalBudget)} | {projectTransactions.length} transactions
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-semibold">Date</th>
                          <th className="text-left py-3 px-2 font-semibold">Phase</th>
                          <th className="text-left py-3 px-2 font-semibold">Vendor/Person</th>
                          <th className="text-right py-3 px-2 font-semibold">Amount</th>
                          <th className="text-left py-3 px-2 font-semibold">Type</th>
                          <th className="text-left py-3 px-2 font-semibold">Reason</th>
                          <th className="text-left py-3 px-2 font-semibold">Status</th>
                          <th className="text-left py-3 px-2 font-semibold">Notes</th>
                          <th className="text-center py-3 px-2 font-semibold">Images</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectTransactions.map(transaction => (
                          <tr key={transaction.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2 text-sm">{formatDate(transaction.date)}</td>
                            <td className="py-3 px-2 text-sm">{transaction.phase.replace('_', ' ')}</td>
                            <td className="py-3 px-2 text-sm">{transaction.vendorName}</td>
                            <td className="py-3 px-2 text-right">
                              <span className={`font-semibold ${transaction.transactionType === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.transactionType === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <Badge variant={transaction.transactionType === 'INCOME' ? 'default' : 'destructive'}>
                                {transaction.transactionType}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 text-sm">{formatReason(transaction.reason)}</td>
                            <td className="py-3 px-2">
                              <Badge variant={
                                transaction.paymentStatus === 'PAID' ? 'default' :
                                transaction.paymentStatus === 'PENDING' ? 'secondary' :
                                transaction.paymentStatus === 'OVERDUE' ? 'destructive' : 'outline'
                              }>
                                {transaction.paymentStatus}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 text-sm text-muted-foreground max-w-[200px] truncate">
                              {transaction.notes || '-'}
                            </td>
                            <td className="py-3 px-2 text-center">
                              {transaction.imageUrls && transaction.imageUrls.length > 0 ? (
                                <div className="flex gap-1 justify-center flex-wrap">
                                  {transaction.imageUrls.map((url, idx) => (
                                    <a
                                      key={idx}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                                      title={`Image ${idx + 1}`}
                                    >
                                      📎{idx + 1} <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </Button>
        </div>
      )}

      {allTransactions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No transactions found matching your filters.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
