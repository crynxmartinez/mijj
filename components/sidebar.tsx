"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FolderKanban, 
  Receipt, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Plus,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects/kanban", icon: FolderKanban },
  { name: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { 
    name: "Reports", 
    icon: BarChart3,
    submenu: [
      { name: "Project Reports", href: "/dashboard/reports" },
      { name: "Trends", href: "/dashboard/reports/trends" }
    ]
  },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(true)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-white">MIJJ</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Quick Action */}
        <div className="p-4">
          <Link href="/dashboard/projects/new">
            <Button 
              className={cn(
                "w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg",
                collapsed && "px-0"
              )}
            >
              <Plus className="h-5 w-5" />
              {!collapsed && <span className="ml-2">New Project</span>}
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            // Check if item has submenu
            if ('submenu' in item && item.submenu) {
              const isSubmenuActive = item.submenu.some(sub => pathname === sub.href || pathname.startsWith(sub.href + "/"))
              
              return (
                <div key={item.name}>
                  {/* Parent menu item */}
                  <button
                    onClick={() => setReportsOpen(!reportsOpen)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isSubmenuActive
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        {reportsOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                  
                  {/* Submenu items */}
                  {!collapsed && reportsOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => {
                        // For exact matching on submenu items to avoid conflicts
                        const isActive = subItem.href === "/dashboard/reports"
                          ? pathname === subItem.href
                          : pathname === subItem.href || pathname.startsWith(subItem.href + "/")
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                              isActive
                                ? "bg-slate-700 text-white border-l-4 border-blue-500"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            )}
                          >
                            <span>{subItem.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }
            
            // Regular menu item without submenu
            if (!item.href) return null
            
            // For Dashboard, use exact match to avoid matching /dashboard/reports etc.
            const isActive = item.href === "/dashboard" 
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-slate-800 text-white border-l-4 border-blue-500"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-slate-800 p-4">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all cursor-pointer",
              collapsed && "justify-center px-2"
            )}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@mijj.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
