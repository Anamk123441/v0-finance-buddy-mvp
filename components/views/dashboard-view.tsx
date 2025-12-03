"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Repeat, Wallet, TrendingDown, CircleDollarSign, Receipt } from "lucide-react"

export function DashboardView() {
  const user = useAppStore((state) => state.user)
  const expenses = useAppStore((state) => state.expenses)
  const recurringExpenses = useAppStore((state) => state.recurringExpenses)
  const toggleDisplayCurrency = useAppStore((state) => state.toggleDisplayCurrency)

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const currentDay = now.getDate()

  const monthExpenses = expenses.filter((exp) => exp.month === currentMonth && !exp.deleted)

  const totalUSD = monthExpenses.reduce((sum, exp) => sum + exp.amountUSD, 0)
  const totalHomeCurrency = monthExpenses.reduce((sum, exp) => sum + exp.amountHomeCurrency, 0)

  const exchangeRate = monthExpenses.length > 0 ? monthExpenses[0].exchangeRateUsed : 1

  const showHomeCurrency = user?.preferredDisplayCurrency === "HOME"

  const budgetUSD = user?.monthlyBudget || 0
  const budgetDisplay = showHomeCurrency ? budgetUSD * exchangeRate : budgetUSD
  const totalDisplay = showHomeCurrency ? totalHomeCurrency : totalUSD
  const remaining = budgetDisplay - totalDisplay
  const spent = totalDisplay / (budgetDisplay || 1)

  const upcomingRecurring = recurringExpenses
    .filter((r) => r.active)
    .map((r) => {
      let daysUntilDue: number
      if (r.dueDay >= currentDay) {
        daysUntilDue = r.dueDay - currentDay
      } else {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
        daysUntilDue = daysInMonth - currentDay + r.dueDay
      }
      return { ...r, daysUntilDue }
    })
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)

  const currencySymbol = showHomeCurrency ? user?.homeCurrency || "USD" : "USD"
  const formatAmount = (amount: number) => {
    if (showHomeCurrency && currencySymbol !== "USD") {
      return `${currencySymbol} ${amount.toFixed(0)}`
    }
    return `$${amount.toFixed(0)}`
  }

  return (
    <div className="px-4 pb-24 pt-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        {user?.homeCurrency && user.homeCurrency !== "USD" && (
          <button
            onClick={toggleDisplayCurrency}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-600 text-white transition-colors shadow-sm font-medium text-sm bg-foreground"
            aria-label="Toggle currency"
          >
            <Repeat className="w-4 h-4" />
            {showHomeCurrency ? user.homeCurrency : "USD"}
          </button>
        )}
      </header>

      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-md bg-white dark:bg-slate-800">
          <div className="p-4 space-y-3 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Budget</p>
              <p className="text-xl font-bold leading-none">{formatAmount(budgetDisplay)}</p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-slate-800">
          <div className="p-4 space-y-3 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-orange-700 dark:text-orange-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Spent</p>
              <p className="text-xl font-bold leading-none">{formatAmount(totalDisplay)}</p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-slate-800">
          <div className="p-4 space-y-3 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CircleDollarSign className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Left</p>
              <p className="text-xl font-bold leading-none">{formatAmount(Math.max(0, remaining))}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-0 shadow-md bg-white dark:bg-slate-800">
        <div className="p-6 space-y-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Budget Progress</p>
              <p className="text-3xl font-bold">{formatAmount(Math.max(0, remaining))}</p>
              <p className="text-sm text-muted-foreground">remaining amount </p>
            </div>
            <div className="text-right bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-xl">
              <p className="text-2xl font-bold">{Math.min(100, Math.round(spent * 100))}%</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">spent</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  spent > 0.9 ? "bg-red-500" : spent > 0.75 ? "bg-orange-500" : "bg-blue-600"
                }`}
                style={{ width: `${Math.min(100, spent * 100)}%` }}
                role="progressbar"
                aria-valuenow={Math.min(100, spent * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatAmount(totalDisplay)}</span>
              <span>{formatAmount(budgetDisplay)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-0 shadow-md bg-white dark:bg-slate-800">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-orange-700 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="font-semibold">Upcoming Bills</h2>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {upcomingRecurring.length > 0 ? (
            <div className="space-y-2">
              {upcomingRecurring.map((recurring) => {
                const recurringAmount = showHomeCurrency ? recurring.amountUSD * exchangeRate : recurring.amountUSD
                const isDueToday = recurring.daysUntilDue === 0
                const isDueSoon = recurring.daysUntilDue <= 3

                return (
                  <div
                    key={recurring.id}
                    className={`flex justify-between items-center py-3 px-4 rounded-xl transition-colors ${
                      isDueToday
                        ? "bg-red-50 dark:bg-red-900/20"
                        : isDueSoon
                          ? "bg-orange-50 dark:bg-orange-900/20"
                          : "bg-slate-50 dark:bg-slate-700/50"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="font-medium text-sm">{recurring.name}</p>
                      <p
                        className={`text-xs text-[rgba(150,47,52,1)] ${isDueToday || isDueSoon ? "font-medium" : "text-muted-foreground"}`}
                      >
                        {recurring.daysUntilDue === 0
                          ? "Due today"
                          : recurring.daysUntilDue === 1
                            ? "Due tomorrow"
                            : `Due in ${recurring.daysUntilDue} days`}
                      </p>
                    </div>
                    <p className="font-bold">{formatAmount(recurringAmount)}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <p className="text-sm text-muted-foreground">No recurring bills set up. Add them in the Bills tab.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
