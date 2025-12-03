"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Repeat, Wallet, TrendingDown, CircleDollarSign, Receipt } from "lucide-react"
import { formatNumberWithCommas } from "@/lib/utils"

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

  const exchangeRate =
    monthExpenses.length > 0
      ? monthExpenses[0].exchangeRateUsed
      : user?.lastKnownExchangeRate || (user?.homeCurrency === "INR" ? 83 : 1)

  const showHomeCurrency = user?.preferredDisplayCurrency === "HOME"

  console.log("[v0] Currency Display Debug:", {
    preferredCurrency: user?.preferredDisplayCurrency,
    showHomeCurrency,
    homeCurrency: user?.homeCurrency,
    exchangeRate,
    lastKnownRate: user?.lastKnownExchangeRate,
    totalUSD,
    totalHomeCurrency,
    monthExpensesCount: monthExpenses.length,
  })

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
      return `${currencySymbol} ${formatNumberWithCommas(amount, 0)}`
    }
    return `$${formatNumberWithCommas(amount, 2)}`
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
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-secondary-foreground transition-colors shadow-sm font-medium text-sm bg-foreground"
            aria-label="Toggle currency"
          >
            <Repeat className="w-4 h-4" />
            {showHomeCurrency ? user.homeCurrency : "USD"}
          </button>
        )}
      </header>

      <Card className="border-0 shadow-md bg-white dark:bg-card overflow-hidden">
        <div className="p-6 flex items-center gap-4">
          <svg
            width="80"
            height="80"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            {/* Background circle with pulse animation */}
            <circle cx="60" cy="60" r="55" fill="#DBEAFE" opacity="0.5">
              <animate attributeName="r" values="55;58;55" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.7;0.5" dur="3s" repeatCount="indefinite" />
            </circle>

            {/* Character body with subtle float animation */}
            <g className="animate-float">
              <circle cx="60" cy="45" r="20" fill="#3B82F6" />
              <ellipse cx="60" cy="80" rx="25" ry="20" fill="#3B82F6" />
              <circle cx="53" cy="42" r="3" fill="white" />
              <circle cx="67" cy="42" r="3" fill="white" />
              <path d="M52 48 Q60 53 68 48" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>

            {/* Left coin with bounce animation */}
            <g className="animate-bounce-slow">
              <circle cx="30" cy="70" r="12" fill="#FB923C" />
              <text x="30" y="75" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
                $
              </text>
            </g>

            {/* Right coin with delayed bounce animation */}
            <g className="animate-bounce-slow-delayed">
              <circle cx="90" cy="70" r="12" fill="#FB923C" />
              <text x="90" y="75" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
                $
              </text>
            </g>

            {/* Decorative circles with pulse */}
            <circle cx="45" cy="35" r="5" fill="#3B82F6" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="75" cy="35" r="5" fill="#3B82F6" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" begin="1s" repeatCount="indefinite" />
            </circle>

            {/* Sparkles with fade animation */}
            <path d="M25 30 L26 32 L28 33 L26 34 L25 36 L24 34 L22 33 L24 32 Z" fill="#FB923C">
              <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
            </path>
            <path d="M95 40 L96 42 L98 43 L96 44 L95 46 L94 44 L92 43 L94 42 Z" fill="#FB923C">
              <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
            </path>
          </svg>

          <div className="flex-1 space-y-1">
            <h2 className="font-bold text-black text-2xl">Your Finance Buddy</h2>
            <p className="text-muted-foreground leading-relaxed text-xs">
              Track your monthly spending, manage your budget, and achieve your financial goals as an international
              student in the U.S.
            </p>
          </div>
        </div>
      </Card>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
          transform-origin: center;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
          transform-origin: center;
        }

        .animate-bounce-slow-delayed {
          animation: bounce-slow 3s ease-in-out infinite;
          animation-delay: 0.5s;
          transform-origin: center;
        }
      `}</style>

      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-md bg-card">
          <div className="p-4 space-y-3 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Budget</p>
              <p className="text-xl font-bold leading-none">{formatAmount(budgetDisplay)}</p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-md bg-card">
          <div className="p-4 space-y-3 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-secondary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Spent</p>
              <p className="text-xl font-bold leading-none">{formatAmount(totalDisplay)}</p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-md bg-card">
          <div className="p-4 space-y-3 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <CircleDollarSign className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Left</p>
              <p className="text-xl font-bold leading-none">{formatAmount(Math.max(0, remaining))}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-0 shadow-md bg-card">
        <div className="p-6 space-y-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Budget Progress</p>
              <p className="text-3xl font-bold">{formatAmount(Math.max(0, remaining))}</p>
              <p className="text-sm text-muted-foreground">remaining amount </p>
            </div>
            <div className="text-right bg-muted px-4 py-2 rounded-xl">
              <p className="text-2xl font-bold">{Math.min(100, Math.round(spent * 100))}%</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">spent</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  spent > 0.9 ? "bg-destructive" : spent > 0.75 ? "bg-secondary" : "bg-primary"
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

      <Card className="border-0 shadow-md bg-card">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-secondary" />
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
                      isDueToday ? "bg-destructive/10" : isDueSoon ? "bg-secondary/10" : "bg-muted"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="font-medium text-sm">{recurring.name}</p>
                      <p
                        className={`text-xs ${isDueToday || isDueSoon ? "font-medium text-destructive" : "text-muted-foreground"}`}
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
            <div className="text-center py-8 bg-muted rounded-xl">
              <p className="text-sm text-muted-foreground">No recurring bills set up. Add them in the Bills tab.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
