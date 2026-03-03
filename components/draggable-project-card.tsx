"use client"

import { useDraggable } from "@dnd-kit/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { GripVertical } from "lucide-react"

interface Transaction {
  id: string
  amount: number
  transactionType: string
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

interface DraggableProjectCardProps {
  project: Project
  onClick: () => void
  getIncome: (project: Project) => number
  getExpenses: (project: Project) => number
  getCurrentBudget: (project: Project) => number
}

export function DraggableProjectCard({ 
  project, 
  onClick, 
  getIncome, 
  getExpenses, 
  getCurrentBudget 
}: DraggableProjectCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-pointer hover:shadow-lg transition-shadow"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2">
          <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing mt-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1" onClick={onClick}>
            <CardTitle className="text-base">{project.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{project.clientName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent onClick={onClick}>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Initial:</span>
            <span className="font-medium">{formatCurrency(project.totalBudget)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Income:</span>
            <span className="font-medium text-green-600">+{formatCurrency(getIncome(project))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expenses:</span>
            <span className="font-medium text-red-600">-{formatCurrency(getExpenses(project))}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-muted-foreground font-semibold">Current:</span>
            <span className="font-bold">{formatCurrency(getCurrentBudget(project))}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
