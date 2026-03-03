"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectDetailModalTable } from "@/components/project-detail-modal-table"
import { formatCurrency } from "@/lib/utils"

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
  imageUrl?: string | null
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

interface ProjectKanbanProps {
  projects: Project[]
}

export function ProjectKanban({ projects }: ProjectKanbanProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const getProjectsByStatus = (status: string) => {
    return projects.filter((p) => p.status === status)
  }

  const preBiddingProjects = getProjectsByStatus("PRE_BIDDING")
  const activeProjects = getProjectsByStatus("ACTIVE")
  const completedProjects = getProjectsByStatus("COMPLETED")

  const handleCardClick = (project: Project) => {
    setSelectedProject(project)
    setModalOpen(true)
  }

  const getIncome = (project: Project) => {
    return project.transactions
      .filter(t => t.transactionType === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getExpenses = (project: Project) => {
    return project.transactions
      .filter(t => t.transactionType === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getCurrentBudget = (project: Project) => {
    return project.totalBudget + getIncome(project) - getExpenses(project)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Projects Kanban</h2>
        <p className="text-muted-foreground">
          Manage projects across different phases
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pre-Bidding Column */}
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-1">Pre-Bidding</h3>
            <p className="text-sm text-muted-foreground">{preBiddingProjects.length} projects</p>
          </div>
          <div className="space-y-3">
            {preBiddingProjects.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCardClick(project)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.clientName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">{formatCurrency(project.totalBudget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spent:</span>
                      <span className="font-medium">{formatCurrency(getSpentAmount(project))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Transactions:</span>
                      <Badge variant="secondary">{project.transactions.length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Project Start Column */}
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-1">Project Start</h3>
            <p className="text-sm text-muted-foreground">{activeProjects.length} projects</p>
          </div>
          <div className="space-y-3">
            {activeProjects.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCardClick(project)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.clientName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">{formatCurrency(project.totalBudget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spent:</span>
                      <span className="font-medium">{formatCurrency(getSpentAmount(project))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Transactions:</span>
                      <Badge variant="secondary">{project.transactions.length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Project End Column */}
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-1">Project End</h3>
            <p className="text-sm text-muted-foreground">{completedProjects.length} projects</p>
          </div>
          <div className="space-y-3">
            {completedProjects.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCardClick(project)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.clientName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">{formatCurrency(project.totalBudget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spent:</span>
                      <span className="font-medium">{formatCurrency(getSpentAmount(project))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Transactions:</span>
                      <Badge variant="secondary">{project.transactions.length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedProject && (
        <ProjectDetailModalTable
          project={selectedProject}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </div>
  )
}
