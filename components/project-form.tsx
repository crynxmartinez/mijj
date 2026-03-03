"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProjectForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [budgetValue, setBudgetValue] = useState("")

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    if (!numericValue) return ""
    const number = parseInt(numericValue)
    return number.toLocaleString("en-US")
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setBudgetValue(formatted)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const budgetNumeric = budgetValue.replace(/,/g, "")
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      clientName: formData.get("clientName"),
      startDate: formData.get("startDate"),
      totalBudget: parseFloat(budgetNumeric),
      status: formData.get("status"),
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push("/dashboard/projects")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to create project:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input id="name" name="name" required placeholder="e.g., Building Construction Phase 1" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <Input id="clientName" name="clientName" required placeholder="e.g., ABC Corporation" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" placeholder="Brief project description" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" name="startDate" type="date" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalBudget">Total Budget (₱)</Label>
          <Input 
            id="totalBudget" 
            name="totalBudget" 
            type="text" 
            required 
            placeholder="2,000,000"
            value={budgetValue}
            onChange={handleBudgetChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Project Status</Label>
        <Select name="status" defaultValue="PRE_BIDDING">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRE_BIDDING">Pre-Bidding</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="ON_HOLD">On Hold</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
