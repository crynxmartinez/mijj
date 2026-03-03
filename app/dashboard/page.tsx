import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { DollarSign, TrendingUp, AlertCircle, FolderKanban } from "lucide-react"
import { BudgetChart } from "@/components/budget-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { ProjectsList } from "@/components/projects-list"

async function getDashboardData() {
  const projects = await prisma.project.findMany({
    include: {
      transactions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const activeProjects = projects.filter(p => p.status === "ACTIVE")
  
  const totalBudget = projects.reduce((sum, p) => sum + p.totalBudget, 0)
  const totalSpent = projects.reduce((sum, p) => {
    const spent = p.transactions.reduce((s, t) => s + t.amount, 0)
    return sum + spent
  }, 0)
  
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  
  const overBudgetProjects = projects.filter(p => {
    const spent = p.transactions.reduce((s, t) => s + t.amount, 0)
    return spent > p.totalBudget
  })

  return {
    projects,
    activeProjects,
    totalBudget,
    totalSpent,
    budgetUtilization,
    overBudgetProjects,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your engineering projects and budget
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalBudget)}</div>
            <p className="text-xs text-muted-foreground">
              Across {data.projects.length} projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              {data.budgetUtilization.toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Over Budget</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {data.overBudgetProjects.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Projects exceeding budget
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <BudgetChart projects={data.projects} />
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <ProjectsList projects={data.projects} />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <RecentTransactions />
        </TabsContent>
      </Tabs>
    </div>
  )
}
