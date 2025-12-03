"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RecurringSetupModal } from "@/components/recurring-setup-modal"
import { Trash2, Plus, Repeat } from "lucide-react"
import { formatNumberWithCommas } from "@/lib/utils"

export function RemindersView() {
  const [isAdding, setIsAdding] = useState(false)

  const user = useAppStore((state) => state.user)
  const recurringExpenses = useAppStore((state) => state.recurringExpenses)
  const deleteRecurringExpense = useAppStore((state) => state.deleteRecurringExpense)
  const expenses = useAppStore((state) => state.expenses)
  const toggleDisplayCurrency = useAppStore((state) => state.toggleDisplayCurrency)

  const activeRecurring = recurringExpenses.filter((r) => r.active).sort((a, b) => a.dueDay - b.dueDay)

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const monthExpenses = expenses.filter((exp) => exp.month === currentMonth && !exp.deleted)
  const exchangeRate = monthExpenses.length > 0 ? monthExpenses[0].exchangeRateUsed : 1

  const showHomeCurrency = user?.preferredDisplayCurrency === "HOME"

  const currencySymbol = showHomeCurrency ? user?.homeCurrency || "USD" : "USD"
  const formatAmount = (amount: number) => {
    const displayAmount = showHomeCurrency ? amount * exchangeRate : amount
    if (showHomeCurrency && currencySymbol !== "USD") {
      return `${currencySymbol} ${formatNumberWithCommas(displayAmount, 0)}`
    }
    return `$${formatNumberWithCommas(displayAmount, 2)}`
  }

  return (
    <div className="p-4 space-y-6">
      <header className="pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Bills</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage recurring bill reminders</p>
          </div>

          {user?.homeCurrency && user.homeCurrency !== "USD" && (
            <button
              onClick={toggleDisplayCurrency}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-secondary-foreground transition-colors shadow-sm font-medium text-sm bg-foreground"
              aria-label="Toggle currency"
            >
              <Repeat className="w-4 h-4" />
              <span>{currencySymbol}</span>
            </button>
          )}
        </div>
      </header>

      <Card className="border-0 shadow-lg">
        <div className="p-6 space-y-4">
          <h2 className="font-semibold">Recurring Bills</h2>

          {activeRecurring.length === 0 ? (
            <div className="space-y-4 text-center py-8">
              <p className="text-sm text-muted-foreground">No recurring bills set up yet. Add one to get reminded!</p>
              <div className="flex justify-center">
                <Button
                  onClick={() => setIsAdding(true)}
                  size="sm"
                  className="bg-black text-white h-9 text-sm font-medium rounded-xl shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Bill
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {activeRecurring.map((recurring) => (
                  <div
                    key={recurring.id}
                    className="flex justify-between items-center py-3 px-4 rounded-xl bg-muted transition-colors"
                  >
                    <div className="space-y-0.5 flex-1">
                      <p className="font-medium text-sm">{recurring.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Due on day {recurring.dueDay} • {recurring.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold">{formatAmount(recurring.amountUSD)}</p>
                      <button
                        onClick={() => deleteRecurringExpense(recurring.id)}
                        className="text-destructive"
                        aria-label="Delete reminder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pt-2">
                <Button
                  onClick={() => setIsAdding(true)}
                  size="sm"
                  className="bg-black text-white h-9 text-sm font-medium rounded-xl shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Bill
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      {isAdding && <RecurringSetupModal onClose={() => setIsAdding(false)} />}
    </div>
  )
}
