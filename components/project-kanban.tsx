"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { ProjectDetailModalTable } from "@/components/project-detail-modal-table"
import { DroppableColumn } from "@/components/droppable-column"
import { DraggableProjectCard } from "@/components/draggable-project-card"

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
  imageUrls: string[]
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

export function ProjectKanban({ projects: initialProjects }: ProjectKanbanProps) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Sync server data with local state when props change
  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) {
      console.log("Drop cancelled - no valid drop zone")
      return
    }

    const projectId = active.id as string
    const newStatus = over.id as string

    const project = projects.find(p => p.id === projectId)
    if (!project) {
      console.error("Project not found:", projectId)
      return
    }
    
    if (project.status === newStatus) {
      console.log("Project already in this status, no update needed")
      return
    }

    console.log(`Moving project "${project.name}" from ${project.status} to ${newStatus}`)

    // Optimistic update - update UI immediately
    setProjects(prevProjects => 
      prevProjects.map(p => 
        p.id === projectId ? { ...p, status: newStatus } : p
      )
    )

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error:", errorData)
        // Revert on error
        setProjects(prevProjects => 
          prevProjects.map(p => 
            p.id === projectId ? { ...p, status: project.status } : p
          )
        )
      } else {
        const updatedProject = await response.json()
        console.log("Project updated successfully:", updatedProject)
      }
    } catch (error) {
      console.error("Failed to update project status:", error)
      // Revert on error
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p.id === projectId ? { ...p, status: project.status } : p
        )
      )
    }
  }

  const activeProject = activeId ? projects.find(p => p.id === activeId) : null

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
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects Kanban</h2>
          <p className="text-muted-foreground">
            Manage projects across different phases
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DroppableColumn
            id="PRE_BIDDING"
            title="Pre-Bidding"
            count={preBiddingProjects.length}
            color="bg-blue-50 dark:bg-blue-950"
          >
            {preBiddingProjects.map((project) => (
              <DraggableProjectCard
                key={project.id}
                project={project}
                onClick={() => handleCardClick(project)}
                getIncome={getIncome}
                getExpenses={getExpenses}
                getCurrentBudget={getCurrentBudget}
              />
            ))}
          </DroppableColumn>

          <DroppableColumn
            id="ACTIVE"
            title="Project Start"
            count={activeProjects.length}
            color="bg-yellow-50 dark:bg-yellow-950"
          >
            {activeProjects.map((project) => (
              <DraggableProjectCard
                key={project.id}
                project={project}
                onClick={() => handleCardClick(project)}
                getIncome={getIncome}
                getExpenses={getExpenses}
                getCurrentBudget={getCurrentBudget}
              />
            ))}
          </DroppableColumn>

          <DroppableColumn
            id="COMPLETED"
            title="Project End"
            count={completedProjects.length}
            color="bg-green-50 dark:bg-green-950"
          >
            {completedProjects.map((project) => (
              <DraggableProjectCard
                key={project.id}
                project={project}
                onClick={() => handleCardClick(project)}
                getIncome={getIncome}
                getExpenses={getExpenses}
                getCurrentBudget={getCurrentBudget}
              />
            ))}
          </DroppableColumn>
        </div>

        {selectedProject && (
          <ProjectDetailModalTable
            project={selectedProject}
            open={modalOpen}
            onOpenChange={setModalOpen}
          />
        )}
      </div>
    </DndContext>
  )
}
