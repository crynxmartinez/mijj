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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      projectId: formData.get("projectId"),
      date: formData.get("date"),
      phase: formData.get("phase"),
      category: formData.get("category"),
      vendorName: formData.get("vendorName"),
      amount: parseFloat(formData.get("amount") as string),
      budgetedAmount: formData.get("budgetedAmount") ? parseFloat(formData.get("budgetedAmount") as string) : null,
      paymentStatus: formData.get("paymentStatus"),
      invoiceNumber: formData.get("invoiceNumber") || null,
      notes: formData.get("notes") || null,
    }

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push("/transactions")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to create transaction:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input id="amount" name="amount" type="number" step="0.01" required placeholder="0.00" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetedAmount">Budgeted Amount ($)</Label>
          <Input id="budgetedAmount" name="budgetedAmount" type="number" step="0.01" placeholder="Optional" />
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
