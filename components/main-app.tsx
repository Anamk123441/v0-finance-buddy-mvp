"use client"

import { useState } from "react"
import { DashboardView } from "@/components/views/dashboard-view"
import { ExpenseView } from "@/components/views/expense-view"
import { RemindersView } from "@/components/views/reminders-view"
import { SettingsView } from "@/components/views/settings-view"
import { LayoutDashboard, Receipt, Bell, Settings } from "lucide-react"

type TabType = "dashboard" | "cashflow" | "reminders" | "settings"

export function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")

  return (
    <div className="min-h-screen pb-20 bg-[rgba(246,250,255,1)]">
      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "cashflow" && <ExpenseView />}
        {activeTab === "reminders" && <RemindersView />}
        {activeTab === "settings" && <SettingsView />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-lg border-t border-border shadow-lg z-50">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all duration-200 ${
                activeTab === "dashboard" ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
              }`}
              aria-label="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("cashflow")}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all duration-200 ${
                activeTab === "cashflow" ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
              }`}
              aria-label="Cashflow"
            >
              <Receipt className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">Cashflow</span>
            </button>

            <button
              onClick={() => setActiveTab("reminders")}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all duration-200 ${
                activeTab === "reminders" ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
              }`}
              aria-label="Bills"
            >
              <Bell className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">Bills</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all duration-200 ${
                activeTab === "settings" ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
              }`}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">Settings</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
