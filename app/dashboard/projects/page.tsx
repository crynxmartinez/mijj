import { Button } from "@/components/ui/button"
import { ProjectsList } from "@/components/projects-list"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"

export const dynamic = 'force-dynamic'

async function getProjects() {
  return await prisma.project.findMany({
    include: {
      transactions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your engineering projects and track budgets
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <ProjectsList projects={projects} />
    </div>
  )
}
