import { prisma } from "@/lib/prisma"
import { ProjectKanban } from "@/components/project-kanban"

export const dynamic = 'force-dynamic'

async function getAllProjects() {
  return await prisma.project.findMany({
    include: {
      transactions: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function ProjectKanbanPage() {
  const projects = await getAllProjects()
  
  return <ProjectKanban projects={projects} />
}
