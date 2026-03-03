import { Navigation, MobileNavigation } from "@/components/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">MIJJ</h1>
            <Navigation className="hidden md:flex" />
          </div>
        </div>
      </header>
      <main className="container py-6 pb-20 md:pb-6">{children}</main>
      <MobileNavigation />
    </div>
  )
}
