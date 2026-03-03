"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Project {
  id: string
  name: string
}

export function TransactionForm({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [amountValue, setAmountValue] = useState("")
  const [budgetedAmountValue, setBudgetedAmountValue] = useState("")
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">("EXPENSE")
  const [imageUrls, setImageUrls] = useState<string[]>([""])

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    if (!numericValue) return ""
    const number = parseInt(numericValue)
    return number.toLocaleString("en-US")
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setAmountValue(formatted)
  }

  const handleBudgetedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setBudgetedAmountValue(formatted)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const amountNumeric = amountValue.replace(/,/g, "")
    const budgetedNumeric = budgetedAmountValue.replace(/,/g, "")
    const data = {
      projectId: formData.get("projectId"),
      date: formData.get("date"),
      phase: formData.get("phase"),
      category: formData.get("category"),
      transactionType: formData.get("transactionType"),
      reason: formData.get("reason"),
      vendorName: formData.get("vendorName"),
      amount: parseFloat(amountNumeric),
      budgetedAmount: budgetedNumeric ? parseFloat(budgetedNumeric) : null,
      paymentStatus: formData.get("paymentStatus"),
      invoiceNumber: formData.get("invoiceNumber") || null,
      imageUrls: imageUrls.filter(url => url.trim() !== ""),
      notes: formData.get("notes") || null,
    }

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push("/dashboard/transactions")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to create transaction:", error)
    } finally {
      setLoading(false)
    }
  }

  const expenseReasons = [
    { value: "LABOR_COSTS", label: "Labor Costs" },
    { value: "MATERIALS_PURCHASE", label: "Materials Purchase" },
    { value: "EQUIPMENT_RENTAL", label: "Equipment Rental" },
    { value: "SUBCONTRACTOR_PAYMENT", label: "Subcontractor Payment" },
    { value: "PERMITS_LICENSES", label: "Permits & Licenses" },
    { value: "UTILITIES", label: "Utilities" },
    { value: "TRANSPORTATION", label: "Transportation" },
    { value: "PROFESSIONAL_FEES", label: "Professional Fees" },
    { value: "INSURANCE", label: "Insurance" },
    { value: "OVERHEAD_COSTS", label: "Overhead Costs" },
    { value: "CONTINGENCY", label: "Contingency" },
    { value: "OTHER_EXPENSES", label: "Other Expenses" },
  ]

  const incomeReasons = [
    { value: "CLIENT_PAYMENT", label: "Client Payment" },
    { value: "CHANGE_ORDER", label: "Change Order" },
    { value: "REFUND", label: "Refund" },
    { value: "RETENTION_RELEASE", label: "Retention Release" },
    { value: "ADVANCE_PAYMENT", label: "Advance Payment" },
    { value: "BUDGET_ADJUSTMENT", label: "Budget Adjustment" },
    { value: "MATERIAL_SALVAGE", label: "Material Salvage" },
    { value: "OTHER_INCOME", label: "Other Income" },
  ]

  const reasonOptions = transactionType === "EXPENSE" ? expenseReasons : incomeReasons

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Transaction Type */}
      <div className="space-y-2">
        <Label>Transaction Type</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="transactionType"
              value="EXPENSE"
              checked={transactionType === "EXPENSE"}
              onChange={(e) => setTransactionType(e.target.value as "EXPENSE")}
              className="w-4 h-4"
            />
            <span className="text-red-600 font-medium">- Expense</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="transactionType"
              value="INCOME"
              checked={transactionType === "INCOME"}
              onChange={(e) => setTransactionType(e.target.value as "INCOME")}
              className="w-4 h-4"
            />
            <span className="text-green-600 font-medium">+ Income</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectId">Project</Label>
        <Select name="projectId" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Transaction Date</Label>
          <Input id="date" name="date" type="date" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phase">Project Phase</Label>
          <Select name="phase" defaultValue="IN_PROGRESS">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRE_BIDDING">Pre-Bidding</SelectItem>
              <SelectItem value="PROJECT_START">Project Start</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETION">Completion</SelectItem>
              <SelectItem value="POST_PROJECT">Post-Project</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
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
        <Label htmlFor="vendorName">Vendor/Person Name</Label>
        <Input id="vendorName" name="vendorName" required placeholder="e.g., John's Construction" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Select name="reason" required>
          <SelectTrigger>
            <SelectValue placeholder="Select reason" />
          </SelectTrigger>
          <SelectContent>
            {reasonOptions.map((reason) => (
              <SelectItem key={reason.value} value={reason.value}>
                {reason.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₱)</Label>
          <Input 
            id="amount" 
            name="amount" 
            type="text" 
            required 
            placeholder="50,000"
            value={amountValue}
            onChange={handleAmountChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetedAmount">Budgeted Amount (₱)</Label>
          <Input 
            id="budgetedAmount" 
            name="budgetedAmount" 
            type="text" 
            placeholder="Optional"
            value={budgetedAmountValue}
            onChange={handleBudgetedAmountChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentStatus">Payment Status</Label>
          <Select name="paymentStatus" defaultValue="PENDING">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input id="invoiceNumber" name="invoiceNumber" placeholder="Optional" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image/Receipt URLs</Label>
        {imageUrls.map((url, index) => (
          <div key={index} className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/receipt.jpg"
              value={url}
              onChange={(e) => {
                const newUrls = [...imageUrls]
                newUrls[index] = e.target.value
                setImageUrls(newUrls)
              }}
            />
            {imageUrls.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
              >
                ✕
              </Button>
            )}
            {index === imageUrls.length - 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setImageUrls([...imageUrls, ""])}
              >
                +
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" name="notes" placeholder="Additional comments or notes" />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Transaction"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
