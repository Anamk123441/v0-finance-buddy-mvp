"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"

export function RecurringList() {
  const recurringExpenses = useAppStore((state) => state.recurringExpenses)
  const user = useAppStore((state) => state.user)
  const deleteRecurring = useAppStore((state) => state.deleteRecurringExpense)

  // Filter active recurring items
  const recurring = recurringExpenses.filter((r) => r.active)

  if (recurring.length === 0) return null

  const totalMonthly = recurring.reduce((sum, r) => sum + r.amountUSD, 0)

  return (
    <Card className="border-0 shadow-lg">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold">This Month's Essentials</h2>
            <p className="text-xs text-muted-foreground mt-1">Recurring monthly expenses</p>
          </div>
        </div>

        <div className="space-y-3">
          {recurring
            .sort((a, b) => a.dueDay - b.dueDay)
            .map((item) => {
              const today = new Date().getDate()
              const isUpcoming = item.dueDay > today
              const isDueSoon = item.dueDay === today

              return (
                <div
                  key={item.id}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    isDueSoon
                      ? "bg-amber-50 dark:bg-amber-950"
                      : isUpcoming
                        ? "bg-slate-50 dark:bg-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 opacity-60"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {item.dueDay === today ? "Today" : `${item.dueDay}th`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">${item.amountUSD.toFixed(2)}</p>
                    <button
                      onClick={() => deleteRecurring(item.id)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
        </div>

        <div className="border-t pt-3 flex justify-between">
          <p className="text-sm font-medium">Monthly total</p>
          <p className="font-semibold">${totalMonthly.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  )
}
