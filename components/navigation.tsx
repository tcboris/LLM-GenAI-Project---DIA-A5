"use client"

import { Home, ScanLine, Settings, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  currentPage: "home" | "scan" | "batch" | "settings"
  onNavigate: (page: "home" | "scan" | "batch" | "settings") => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: "home" as const, icon: Home, label: "Home" },
    { id: "scan" as const, icon: ScanLine, label: "Scanner" },
    { id: "batch" as const, icon: FolderOpen, label: "Batch" },
    { id: "settings" as const, icon: Settings, label: "Settings" },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-20 lg:w-64 glass border-r border-border/30 flex-col items-center lg:items-start p-6 gap-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <ScanLine className="w-6 h-6 text-primary" />
          </div>
          <span className="hidden lg:block text-xl font-bold text-glow">AI Scanner</span>
        </div>

        <nav className="flex flex-col gap-2 w-full">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                "hover:bg-primary/10 hover:border-primary/30 border border-transparent",
                currentPage === item.id && "bg-primary/20 border-primary/40 shadow-[0_0_20px_var(--glow-primary)]",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  currentPage === item.id ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "hidden lg:block font-medium transition-colors",
                  currentPage === item.id ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-border/30 px-6 py-4 z-50">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300",
                currentPage === item.id && "text-primary",
              )}
            >
              <item.icon
                className={cn(
                  "w-6 h-6 transition-colors",
                  currentPage === item.id ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  currentPage === item.id ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
