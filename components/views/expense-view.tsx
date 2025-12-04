"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { AddIncomeModal } from "@/components/add-income-modal"
import { Trash2, Repeat, Plus } from "lucide-react"
import { formatNumberWithCommas } from "@/lib/utils"

export function ExpenseView() {
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [isAddingIncome, setIsAddingIncome] = useState(false)

  const user = useAppStore((state) => state.user)
  const expenses = useAppStore((state) => state.expenses)
  const incomes = useAppStore((state) => state.incomes)
  const deleteExpense = useAppStore((state) => state.deleteExpense)
  const deleteIncome = useAppStore((state) => state.deleteIncome)
  const toggleDisplayCurrency = useAppStore((state) => state.toggleDisplayCurrency)

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const monthExpenses = expenses.filter((exp) => exp.month === currentMonth && !exp.deleted)
  const monthIncomes = incomes.filter((inc) => inc.month === currentMonth && !inc.deleted)

  const exchangeRate = user?.lastKnownExchangeRate || 1

  const showHomeCurrency = user?.preferredDisplayCurrency === "HOME"

  const categoryMap = new Map<string, number>()
  monthExpenses.forEach((exp) => {
    const amount = showHomeCurrency ? exp.amountUSD * exchangeRate : exp.amountUSD
    categoryMap.set(exp.category, (categoryMap.get(exp.category) || 0) + amount)
  })

  const categorySpending = Array.from(categoryMap.entries())
    .map(([category, spent]) => ({ category, spent }))
    .sort((a, b) => b.spent - a.spent)

  const totalIncome = showHomeCurrency
    ? monthIncomes.reduce((sum, inc) => sum + inc.amountUSD * exchangeRate, 0)
    : monthIncomes.reduce((sum, inc) => sum + inc.amountUSD, 0)

  const totalExpense = showHomeCurrency
    ? monthExpenses.reduce((sum, exp) => sum + exp.amountUSD * exchangeRate, 0)
    : monthExpenses.reduce((sum, exp) => sum + exp.amountUSD, 0)

  const currencySymbol = showHomeCurrency ? user?.homeCurrency || "USD" : "USD"
  const formatAmount = (amount: number) => {
    if (showHomeCurrency && currencySymbol !== "USD") {
      return `${currencySymbol} ${formatNumberWithCommas(amount, 0)}`
    }
    return `$${formatNumberWithCommas(amount, 2)}`
  }

  const handleOpenExpenseModal = () => {
    setIsAddingExpense(true)
  }

  const handleCloseExpenseModal = () => {
    setIsAddingExpense(false)
  }

  const handleOpenIncomeModal = () => {
    setIsAddingIncome(true)
  }

  const handleCloseIncomeModal = () => {
    setIsAddingIncome(false)
  }

  return (
    <div className="px-4 pb-24 pt-6 space-y-6">
      <header className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Cashflow</h1>
            <p className="text-sm text-muted-foreground mt-1">Track your monthly income and expenses</p>
          </div>

          {user?.homeCurrency && user.homeCurrency !== "USD" && (
            <button
              onClick={toggleDisplayCurrency}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-secondary-foreground transition-colors shadow-sm font-medium text-sm bg-foreground"
              aria-label="Toggle currency"
            >
              <Repeat className="w-4 h-4" />
              <span className="text-sm font-medium">{showHomeCurrency ? "USD" : user.homeCurrency}</span>
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-md bg-card">
          <div className="p-5 flex flex-col items-center space-y-3">
            <svg
              width="80"
              height="80"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-90"
            >
              <circle cx="60" cy="60" r="50" fill="#FFEDD5" />
              <rect x="35" y="45" width="50" height="35" rx="4" fill="#F97316" />
              <path d="M35 45 Q60 40 85 45 L85 52 L35 52 Z" fill="#EA580C" />
              <rect x="45" y="58" width="30" height="5" rx="1" fill="#FED7AA" />
              <rect x="45" y="67" width="25" height="4" rx="1" fill="#FED7AA" />
              <path d="M60 85 L55 78 L58 78 L58 72 L62 72 L62 78 L65 78 Z" fill="#DC2626" />
              <circle cx="40" cy="35" r="5" fill="#FB923C" opacity="0.7" />
              <circle cx="80" cy="38" r="4" fill="#FB923C" opacity="0.7" />
            </svg>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold mt-2 text-orange-500">{formatAmount(totalExpense)}</p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-md bg-card">
          <div className="p-5 flex flex-col items-center space-y-3">
            <svg
              width="80"
              height="80"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-90"
            >
              <circle cx="60" cy="60" r="50" fill="#DBEAFE" />
              <rect x="30" y="50" width="50" height="30" rx="3" fill="#3B82F6" opacity="0.6" />
              <rect x="35" y="45" width="50" height="30" rx="3" fill="#60A5FA" />
              <rect x="40" y="40" width="50" height="30" rx="3" fill="#3B82F6" />
              <text x="65" y="62" fontSize="20" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                $
              </text>
              <path d="M60 25 L55 32 L58 32 L58 38 L62 38 L62 32 L65 32 Z" fill="#10B981" />
              <circle cx="45" cy="57" r="2" fill="#93C5FD" />
              <circle cx="85" cy="57" r="2" fill="#93C5FD" />
            </svg>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold mt-2 text-primary">{formatAmount(totalIncome)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-card">
        <div className="p-6 space-y-4">
          <h2 className="font-semibold">Category-wise Expenses</h2>
          {categorySpending.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No expenses yet this month</p>
          ) : (
            <div className="space-y-3">
              {categorySpending.map(({ category, spent }) => (
                <div key={category} className="flex justify-between items-center">
                  <p className="text-sm font-medium">{category}</p>
                  <p className="text-sm font-bold">{formatAmount(spent)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="border-0 shadow-lg bg-card">
        <div className="p-6 space-y-4">
          <h2 className="font-semibold">All Expenses</h2>
          {monthExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
              >
                <circle cx="60" cy="60" r="50" fill="#FFEDD5" />
                <rect x="35" y="45" width="50" height="35" rx="4" fill="#F97316" />
                <path d="M35 45 Q60 40 85 45 L85 52 L35 52 Z" fill="#EA580C" />
                <rect x="45" y="58" width="30" height="5" rx="1" fill="#FED7AA" />
                <rect x="45" y="67" width="25" height="4" rx="1" fill="#FED7AA" />
                <path d="M60 85 L55 78 L58 78 L58 72 L62 72 L62 78 L65 78 Z" fill="#DC2626" />
                <circle cx="40" cy="35" r="5" fill="#FB923C" opacity="0.7" />
                <circle cx="80" cy="38" r="4" fill="#FB923C" opacity="0.7" />
              </svg>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-foreground">No expenses logged yet</p>
                <p className="text-xs text-muted-foreground">Start tracking by adding your first expense</p>
              </div>
              <Button
                onClick={() => setIsAddingExpense(true)}
                className="bg-secondary text-secondary-foreground h-9 text-sm font-medium rounded-xl shadow-sm"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Expense
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {monthExpenses
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((expense) => {
                    const displayAmount = showHomeCurrency ? expense.amountUSD * exchangeRate : expense.amountUSD
                    const altAmount = showHomeCurrency ? expense.amountUSD : expense.amountUSD * exchangeRate
                    const altCurrency = showHomeCurrency ? "USD" : user?.homeCurrency || "USD"

                    return (
                      <div
                        key={expense.id}
                        className="flex justify-between items-center py-2 px-3 rounded bg-orange-50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{expense.category}</p>
                          {expense.note && <p className="text-xs text-muted-foreground">{expense.note}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold text-sm text-foreground">{formatAmount(displayAmount)}</p>
                            <p className="text-xs text-muted-foreground">
                              ≈{" "}
                              {showHomeCurrency
                                ? `$${formatNumberWithCommas(altAmount, 2)}`
                                : `${altCurrency} ${formatNumberWithCommas(altAmount, 0)}`}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="text-destructive"
                            aria-label="Delete expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>
              <div className="flex justify-center pt-2">
                <Button
                  onClick={() => setIsAddingExpense(true)}
                  className="bg-secondary text-secondary-foreground h-9 text-sm font-medium rounded-xl shadow-sm"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Expense
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      <Card className="border-0 shadow-lg bg-card">
        <div className="p-6 space-y-4">
          <h2 className="font-semibold">All Income</h2>
          {monthIncomes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
              >
                <circle cx="60" cy="60" r="50" fill="#DBEAFE" />
                <rect x="30" y="50" width="50" height="30" rx="3" fill="#3B82F6" opacity="0.6" />
                <rect x="35" y="45" width="50" height="30" rx="3" fill="#60A5FA" />
                <rect x="40" y="40" width="50" height="30" rx="3" fill="#3B82F6" />
                <text x="65" y="62" fontSize="20" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                  $
                </text>
                <path d="M60 25 L55 32 L58 32 L58 38 L62 38 L62 32 L65 32 Z" fill="#10B981" />
                <circle cx="45" cy="57" r="2" fill="#93C5FD" />
                <circle cx="85" cy="57" r="2" fill="#93C5FD" />
              </svg>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-foreground">No income logged yet</p>
                <p className="text-xs text-muted-foreground">Start tracking by adding your first income</p>
              </div>
              <Button
                onClick={() => setIsAddingIncome(true)}
                className="bg-primary text-primary-foreground h-9 text-sm font-medium rounded-xl shadow-sm"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Income
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {monthIncomes
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((income) => {
                    const displayAmount = showHomeCurrency ? income.amountUSD * exchangeRate : income.amountUSD
                    const altAmount = showHomeCurrency ? income.amountUSD : income.amountUSD * exchangeRate
                    const altCurrency = showHomeCurrency ? "USD" : user?.homeCurrency || "USD"

                    return (
                      <div
                        key={income.id}
                        className="flex justify-between items-center py-2 px-3 rounded bg-[rgba(240,245,255,1)]"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{income.source}</p>
                          {income.note && <p className="text-xs text-muted-foreground">{income.note}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold text-sm text-foreground">{formatAmount(displayAmount)}</p>
                            <p className="text-xs text-muted-foreground">
                              ≈{" "}
                              {showHomeCurrency
                                ? `$${formatNumberWithCommas(altAmount, 2)}`
                                : `${altCurrency} ${formatNumberWithCommas(altAmount, 0)}`}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteIncome(income.id)}
                            className="text-destructive"
                            aria-label="Delete income"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>
              <div className="flex justify-center pt-2">
                <Button
                  onClick={() => setIsAddingIncome(true)}
                  className="bg-primary text-primary-foreground h-9 text-sm font-medium rounded-xl shadow-sm"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Income
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      {isAddingExpense && <AddExpenseModal onClose={handleCloseExpenseModal} />}
      {isAddingIncome && <AddIncomeModal onClose={handleCloseIncomeModal} />}
    </div>
  )
}
