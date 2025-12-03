"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"

export function MotivationalCard() {
  const user = useAppStore((state) => state.user)
  const expenses = useAppStore((state) => state.expenses)

  // Compute values directly in component
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const monthExpenses = expenses.filter((exp) => exp.month === currentMonth && !exp.deleted)
  const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amountUSD, 0)
  const budget = user?.monthlyBudget || 1
  const spent = monthTotal / budget

  // Get motivational message
  let message = "Great start! You're well under budget."
  if (spent === 0) {
    message = "You haven't logged any expenses yet. Start tracking to build the habit!"
  } else if (spent > 0.95) {
    message = "You're close to your limit. Be mindful of your spending!"
  } else if (spent > 0.75) {
    message = "You've spent most of your budget. Consider reducing expenses."
  } else if (spent > 0.5) {
    message = "You're at a healthy spending pace. Keep it up!"
  }

  // Get category spending
  const categoryMap = new Map<string, number>()
  monthExpenses.forEach((exp) => {
    categoryMap.set(exp.category, (categoryMap.get(exp.category) || 0) + exp.amountUSD)
  })
  const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0)
  const categorySpending = Array.from(categoryMap.entries())
    .map(([category, spent]) => ({
      category,
      spent,
      percentage: (spent / Math.max(total, 1)) * 100,
    }))
    .sort((a, b) => b.spent - a.spent)

  return (
    <Card className="border-0 shadow-lg">
      <div className="p-6 space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{message}</p>
        </div>

        {categorySpending.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-3">Spending by Category</p>
            <div className="space-y-2">
              {categorySpending.slice(0, 4).map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1">{cat.category}</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                  <p className="text-xs font-semibold ml-2 w-12 text-right">${cat.spent.toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
