"use client"

import { useState } from "react"
import HomePage from "@/components/home-page"
import ScannerPage from "@/components/scanner-page"
import SettingsPage from "@/components/settings-page"
import Navigation from "@/components/navigation"

export default function Page() {
  const [currentPage, setCurrentPage] = useState<"home" | "scan" | "settings">("home")

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-125 h-125 bg-primary/20 rounded-full blur-[150px] animate-float" />
        <div
          className="absolute bottom-0 left-0 w-150 h-150 bg-accent/15 rounded-full blur-[180px] animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

        <main className="flex-1 transition-all duration-300 ease-in-out">
          <div className="opacity-100 animate-in fade-in duration-500">
            {currentPage === "home" && <HomePage />}
            {currentPage === "scan" && <ScannerPage />}
            {currentPage === "settings" && <SettingsPage />}
          </div>
        </main>
      </div>
    </div>
  )
}
