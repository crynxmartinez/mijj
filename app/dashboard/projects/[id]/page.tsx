import { prisma } from "@/lib/prisma"
import { ProjectKanban } from "@/components/project-kanban"
import { notFound } from "next/navigation"

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
    },
  })
  
  if (!project) {
    notFound()
  }
  
  return project
}

async function getAllProjects() {
  return await prisma.project.findMany({
    include: {
      transactions: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const projects = await getAllProjects()
  
  return <ProjectKanban projects={projects} />
}
