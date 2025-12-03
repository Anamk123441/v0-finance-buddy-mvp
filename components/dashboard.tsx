"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { RecurringList } from "@/components/recurring-list"
import { RecurringSetupModal } from "@/components/recurring-setup-modal"
import { AchievementsSection } from "@/components/achievements-section"
import { MotivationalCard } from "@/components/motivational-card"
import { useState } from "react"

export function Dashboard() {
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [isAddingRecurring, setIsAddingRecurring] = useState(false)
  const user = useAppStore((state) => state.user)
  const expenses = useAppStore((state) => state.expenses)

  // Compute current month expenses
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const monthExpenses = expenses.filter((exp) => exp.month === currentMonth && !exp.deleted)

  const totalUSD = monthExpenses.reduce((sum, exp) => sum + exp.amountUSD, 0)
  const totalHomeCurrency = monthExpenses.reduce((sum, exp) => sum + exp.amountHomeCurrency, 0)
  const remaining = (user?.monthlyBudget || 0) - totalUSD
  const spent = totalUSD / (user?.monthlyBudget || 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
      <div className="max-w-2xl mx-auto p-4 space-y-6 pb-12">
        <header className="pt-6 pb-4">
          <h1 className="text-3xl font-bold text-balance">This Month</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </header>

        {/* Total Spent Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
          <div className="p-6 space-y-4">
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Total Spent This Month</p>
            <div className="space-y-1">
              <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-50">${totalUSD.toFixed(2)}</p>
              <p className="text-sm text-emerald-800 dark:text-emerald-200">
                ≈ {user?.homeCurrency} {totalHomeCurrency.toFixed(0)}
              </p>
            </div>
          </div>
        </Card>

        {/* Budget Progress */}
        <Card className="border-0 shadow-lg">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Budget Remaining</p>
                <p className="text-2xl font-bold mt-1">${Math.max(0, remaining).toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{Math.min(100, Math.round(spent * 100))}% of budget</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  spent > 0.9 ? "bg-red-500" : spent > 0.75 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, spent * 100)}%` }}
                role="progressbar"
                aria-valuenow={Math.min(100, spent * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            {/* Status Message */}
            {spent > 0.9 && remaining > 0 && (
              <p className="text-sm text-amber-700 dark:text-amber-200 bg-amber-50 dark:bg-amber-950 p-3 rounded">
                At this pace, you may overspend by $
                {Math.round(spent * (user?.monthlyBudget || 0) - (user?.monthlyBudget || 0))}.
              </p>
            )}
            {spent < 0.5 && (
              <p className="text-sm text-emerald-700 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950 p-3 rounded">
                You're doing great! You're below your expected pace.
              </p>
            )}
          </div>
        </Card>

        {/* Motivational Card */}
        <MotivationalCard />

        {/* Recurring Expenses Section */}
        <RecurringList />

        {/* Achievements Section */}
        <AchievementsSection />

        {/* Add Buttons */}
        <div className="flex gap-3 sticky bottom-4 z-30">
          <Button
            onClick={() => setIsAddingExpense(true)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base font-medium"
            size="lg"
            aria-label="Add new expense"
          >
            + Expense
          </Button>
          <Button
            onClick={() => setIsAddingRecurring(true)}
            variant="outline"
            className="flex-1 h-12 text-base font-medium"
            size="lg"
            aria-label="Add recurring expense"
          >
            + Recurring
          </Button>
        </div>

        {/* Recent Expenses */}
        <Card className="border-0 shadow-lg">
          <div className="p-6 space-y-4">
            <h2 className="font-semibold">Recent Expenses</h2>
            {monthExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No expenses yet. Add one to get started!</p>
            ) : (
              <div className="space-y-3">
                {monthExpenses
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium text-sm">{expense.category}</p>
                        {expense.note && <p className="text-xs text-muted-foreground">{expense.note}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${expense.amountUSD.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          ≈ {user?.homeCurrency} {expense.amountHomeCurrency.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {isAddingExpense && <AddExpenseModal onClose={() => setIsAddingExpense(false)} />}
      {isAddingRecurring && <RecurringSetupModal onClose={() => setIsAddingRecurring(false)} />}
    </div>
  )
}
