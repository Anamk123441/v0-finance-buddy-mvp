import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  homeCurrency: string
  monthlyBudget: number
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
  preferredDisplayCurrency: "USD" | "HOME"
  lastKnownExchangeRate?: number
}

export interface Expense {
  id: string
  amountUSD: number
  amountHomeCurrency: number
  exchangeRateUsed: number
  exchangeRateDate: string
  category: string
  tags: string[]
  note: string
  timestamp: string
  month: string
  createdAt: string
  deleted: boolean
}

export interface BudgetLimit {
  id: string
  category: string
  limitUSD: number
  month: string
  createdAt: string
}

export interface RecurringExpense {
  id: string
  name: string
  amountUSD: number
  dueDay: number
  frequency: "monthly" | "spring-semester" | "fall-semester"
  category: string
  active: boolean
  notifiedMonths: string[]
  createdAt: string
  updatedAt: string
}

export interface Alert {
  id: string
  type: "budget_threshold" | "projected_overspend" | "recurring_due"
  severity: "info" | "warning" | "critical"
  message: string
  actionRequired: boolean
  dismissedAt?: string
  createdAt: string
}

export interface Achievement {
  id: string
  type: "7-day-streak" | "first-expense" | "under-budget" | "consistent-tracker" | "category-master"
  earnedAt: string
  month: string
  title: string
  description: string
  icon: string
}

export interface Income {
  id: string
  amountUSD: number
  amountHomeCurrency: number
  exchangeRateUsed: number
  exchangeRateDate: string
  source: string
  note: string
  timestamp: string
  month: string
  createdAt: string
  deleted: boolean
}

interface AppStore {
  user: User | null
  expenses: Expense[]
  incomes: Income[]
  budgets: BudgetLimit[]
  recurringExpenses: RecurringExpense[]
  alerts: Alert[]
  achievements: Achievement[]

  initializeUser: (data: { homeCurrency: string; monthlyBudget: number }) => void
  addIncome: (data: { amountUSD: number; source: string; note?: string; exchangeRate: number }) => void
  getCurrentMonthIncomes: () => Income[]
  deleteIncome: (incomeId: string) => void
  updateUser: (data: Partial<User>) => void
  toggleDisplayCurrency: () => void
  addExpense: (data: {
    amountUSD: number
    category: string
    note?: string
    exchangeRate: number
  }) => void
  getCurrentMonthExpenses: () => Expense[]
  getMonthlyTotal: (month: string) => { usd: number; homeCurrency: number }
  updateExpenseNote: (expenseId: string, newNote: string) => void
  deleteExpense: (expenseId: string) => void
  addRecurringExpense: (data: {
    name: string
    amountUSD: number
    dueDay: number
    category: string
    frequency: "monthly" | "spring-semester" | "fall-semester"
  }) => void
  getRecurringExpenses: () => RecurringExpense[]
  deleteRecurringExpense: (id: string) => void
  getUpcomingRecurringExpenses: () => RecurringExpense[]
  generateAlertsForMonth: () => void
  getActiveAlerts: () => Alert[]
  dismissAlert: (alertId: string) => void
  getProjectedSpend: () => {
    projected: number
    daysInMonth: number
    daysLeft: number
    overspendAmount: number
  }
  getStreak: () => number
  checkAndEarnAchievements: () => void
  getRecentAchievements: () => Achievement[]
  getMotivationalMessage: () => string
  getCategorySpending: () => { category: string; spent: number; percentage: number }[]
  resetAllData: () => void
}

const generateId = () => Math.random().toString(36).substring(2, 9)

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      expenses: [],
      incomes: [],
      budgets: [],
      recurringExpenses: [],
      alerts: [],
      achievements: [],

      initializeUser: (data) => {
        const now = new Date().toISOString()
        set({
          user: {
            id: generateId(),
            homeCurrency: data.homeCurrency,
            monthlyBudget: data.monthlyBudget,
            onboardingCompleted: false,
            preferredDisplayCurrency: "HOME",
            createdAt: now,
            updatedAt: now,
            lastKnownExchangeRate: undefined,
          },
        })
      },

      addIncome: (data) => {
        const now = new Date()
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
        const exchangeRate = data.exchangeRate || 83

        const income: Income = {
          id: generateId(),
          amountUSD: data.amountUSD,
          amountHomeCurrency: data.amountUSD * exchangeRate,
          exchangeRateUsed: exchangeRate,
          exchangeRateDate: now.toISOString().split("T")[0],
          source: data.source,
          note: data.note || "",
          timestamp: now.toISOString(),
          month,
          createdAt: now.toISOString(),
          deleted: false,
        }

        set((state) => ({
          incomes: [...state.incomes, income],
          user: state.user ? { ...state.user, lastKnownExchangeRate: exchangeRate } : null,
        }))
      },

      getCurrentMonthIncomes: () => {
        const now = new Date()
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
        return get().incomes.filter((inc) => inc.month === month && !inc.deleted)
      },

      deleteIncome: (incomeId) => {
        set((state) => ({
          incomes: state.incomes.map((inc) => (inc.id === incomeId ? { ...inc, deleted: true } : inc)),
        }))
      },

      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data, updatedAt: new Date().toISOString() } : null,
        }))
      },

      toggleDisplayCurrency: () => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferredDisplayCurrency: state.user.preferredDisplayCurrency === "USD" ? "HOME" : "USD",
                updatedAt: new Date().toISOString(),
              }
            : null,
        }))
      },

      addExpense: (data) => {
        const now = new Date()
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
        const exchangeRate = data.exchangeRate || 83

        const expense: Expense = {
          id: generateId(),
          amountUSD: data.amountUSD,
          amountHomeCurrency: data.amountUSD * exchangeRate,
          exchangeRateUsed: exchangeRate,
          exchangeRateDate: now.toISOString().split("T")[0],
          category: data.category,
          tags: [],
          note: data.note || "",
          timestamp: now.toISOString(),
          month,
          createdAt: now.toISOString(),
          deleted: false,
        }

        set((state) => ({
          expenses: [...state.expenses, expense],
          user: state.user ? { ...state.user, lastKnownExchangeRate: exchangeRate } : null,
        }))

        setTimeout(() => {
          get().generateAlertsForMonth()
          get().checkAndEarnAchievements()
        }, 100)
      },

      getCurrentMonthExpenses: () => {
        const now = new Date()
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
        return get().expenses.filter((exp) => exp.month === month && !exp.deleted)
      },

      getMonthlyTotal: (month) => {
        const monthExpenses = get().expenses.filter((exp) => exp.month === month && !exp.deleted)
        const monthIncomes = get().incomes.filter((inc) => inc.month === month && !inc.deleted)
        const totalExpensesUSD = monthExpenses.reduce((sum, exp) => sum + exp.amountUSD, 0)
        const totalIncomesUSD = monthIncomes.reduce((sum, inc) => sum + inc.amountUSD, 0)
        const totalExpensesHomeCurrency = monthExpenses.reduce((sum, exp) => sum + exp.amountHomeCurrency, 0)
        const totalIncomesHomeCurrency = monthIncomes.reduce((sum, inc) => sum + inc.amountHomeCurrency, 0)
        return {
          usd: totalIncomesUSD - totalExpensesUSD,
          homeCurrency: totalIncomesHomeCurrency - totalExpensesHomeCurrency,
        }
      },

      updateExpenseNote: (expenseId, newNote) => {
        set((state) => ({
          expenses: state.expenses.map((exp) => (exp.id === expenseId ? { ...exp, note: newNote } : exp)),
        }))
      },

      deleteExpense: (expenseId) => {
        set((state) => ({
          expenses: state.expenses.map((exp) => (exp.id === expenseId ? { ...exp, deleted: true } : exp)),
        }))
        setTimeout(() => get().generateAlertsForMonth(), 100)
      },

      addRecurringExpense: (data) => {
        const now = new Date().toISOString()
        const recurring: RecurringExpense = {
          id: generateId(),
          name: data.name,
          amountUSD: data.amountUSD,
          dueDay: data.dueDay,
          frequency: data.frequency,
          category: data.category,
          active: true,
          notifiedMonths: [],
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          recurringExpenses: [...state.recurringExpenses, recurring],
        }))
      },

      getRecurringExpenses: () => {
        return get().recurringExpenses.filter((r) => r.active)
      },

      deleteRecurringExpense: (id) => {
        set((state) => ({
          recurringExpenses: state.recurringExpenses.map((r) => (r.id === id ? { ...r, active: false } : r)),
        }))
      },

      getUpcomingRecurringExpenses: () => {
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
        const currentDay = now.getDate()

        return get().recurringExpenses.filter((r) => {
          if (!r.active) return false
          if (r.notifiedMonths.includes(currentMonth)) return false
          return r.dueDay >= currentDay
        })
      },

      generateAlertsForMonth: () => {
        const state = get()
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
        const currentDay = now.getDate()

        const { projected, overspendAmount } = state.getProjectedSpend()
        const budget = state.user?.monthlyBudget || 0
        const spent = state.getMonthlyTotal(currentMonth).usd

        const newAlerts: Alert[] = []

        if (spent > budget * 0.75 && spent < budget * 0.9) {
          newAlerts.push({
            id: generateId(),
            type: "budget_threshold",
            severity: "warning",
            message: `You've spent ${Math.round((spent / budget) * 100)}% of your monthly budget.`,
            actionRequired: false,
            createdAt: now.toISOString(),
          })
        }

        if (spent > budget * 0.9) {
          newAlerts.push({
            id: generateId(),
            type: "budget_threshold",
            severity: "critical",
            message: `You're approaching your limit (${Math.round((spent / budget) * 100)}% spent).`,
            actionRequired: true,
            createdAt: now.toISOString(),
          })
        }

        if (overspendAmount > 0) {
          newAlerts.push({
            id: generateId(),
            type: "projected_overspend",
            severity: "critical",
            message: `At this pace, you may overspend by $${overspendAmount.toFixed(2)}.`,
            actionRequired: true,
            createdAt: now.toISOString(),
          })
        }

        set((st) => {
          const existingAlerts = st.alerts.filter((a) => !a.dismissedAt)
          const typesToRemove = new Set(newAlerts.map((a) => a.type))
          const filtered = existingAlerts.filter((a) => !typesToRemove.has(a.type))
          return {
            alerts: [...filtered, ...newAlerts],
          }
        })
      },

      getActiveAlerts: () => {
        return get()
          .alerts.filter((a) => !a.dismissedAt)
          .sort((a, b) => {
            const severityOrder = { critical: 0, warning: 1, info: 2 }
            return severityOrder[a.severity] - severityOrder[b.severity]
          })
      },

      dismissAlert: (alertId) => {
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, dismissedAt: new Date().toISOString() } : a)),
        }))
      },

      getProjectedSpend: () => {
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
        const currentDay = now.getDate()
        const budget = get().user?.monthlyBudget || 0

        const spent = get().getMonthlyTotal(currentMonth).usd
        const spendPerDay = spent / Math.max(1, currentDay)
        const projected = spendPerDay * daysInMonth
        const overspendAmount = Math.max(0, projected - budget)

        return {
          projected: projected,
          daysInMonth,
          daysLeft: daysInMonth - currentDay,
          overspendAmount,
        }
      },

      getStreak: () => {
        const now = new Date()
        let streak = 0
        const checkDate = new Date(now)

        while (streak < 365) {
          const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`
          const hasExpense = get().expenses.some((exp) => exp.timestamp.startsWith(dateStr) && !exp.deleted)

          if (!hasExpense) break
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        }

        return streak
      },

      checkAndEarnAchievements: () => {
        const state = get()
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
        const newAchievements: Achievement[] = []

        // First expense
        if (state.expenses.length === 1) {
          newAchievements.push({
            id: generateId(),
            type: "first-expense",
            earnedAt: now.toISOString(),
            month: currentMonth,
            title: "Welcome to Tracking",
            description: "You logged your first expense!",
            icon: "🎉",
          })
        }

        // 7-day streak
        const streak = state.getStreak()
        const previousStreaks = state.achievements.filter((a) => a.type === "7-day-streak")
        if (streak >= 7 && previousStreaks.length === 0) {
          newAchievements.push({
            id: generateId(),
            type: "7-day-streak",
            earnedAt: now.toISOString(),
            month: currentMonth,
            title: "On a Roll",
            description: "You've tracked expenses for 7 days straight!",
            icon: "🔥",
          })
        }

        // Under budget
        const monthlyTotal = state.getMonthlyTotal(currentMonth).usd
        const budget = state.user?.monthlyBudget || 0
        const previousUnderBudget = state.achievements.filter(
          (a) => a.type === "under-budget" && a.month === currentMonth,
        )
        if (monthlyTotal > 0 && monthlyTotal < budget * 0.9 && previousUnderBudget.length === 0) {
          newAchievements.push({
            id: generateId(),
            type: "under-budget",
            earnedAt: now.toISOString(),
            month: currentMonth,
            title: "Budget Master",
            description: "You're spending 10% less than your budget!",
            icon: "💰",
          })
        }

        // Consistent tracker
        const monthExpenses = state.getCurrentMonthExpenses()
        if (monthExpenses.length >= 10) {
          const previousConsistent = state.achievements.filter(
            (a) => a.type === "consistent-tracker" && a.month === currentMonth,
          )
          if (previousConsistent.length === 0) {
            newAchievements.push({
              id: generateId(),
              type: "consistent-tracker",
              earnedAt: now.toISOString(),
              month: currentMonth,
              title: "Detail Oriented",
              description: "You've logged 10+ expenses this month!",
              icon: "📝",
            })
          }
        }

        if (newAchievements.length > 0) {
          set((st) => ({
            achievements: [...st.achievements, ...newAchievements],
          }))
        }
      },

      getRecentAchievements: () => {
        return get()
          .achievements.sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
          .slice(0, 5)
      },

      getMotivationalMessage: () => {
        const state = get()
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
        const monthTotal = state.getMonthlyTotal(currentMonth).usd
        const budget = state.user?.monthlyBudget || 1
        const spent = monthTotal / budget

        if (spent === 0) {
          return "You haven't logged any expenses yet. Start tracking to build the habit!"
        }

        if (spent > 0.95) {
          return "You're close to your limit. Be mindful of your spending!"
        }

        if (spent > 0.75) {
          return "You've spent most of your budget. Consider reducing expenses."
        }

        if (spent > 0.5) {
          return "You're at a healthy spending pace. Keep it up!"
        }

        return "Great start! You're well under budget."
      },

      getCategorySpending: () => {
        const state = get()
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
        const monthExpenses = state.expenses.filter((exp) => exp.month === currentMonth && !exp.deleted)

        const categoryMap = new Map<string, number>()
        monthExpenses.forEach((exp) => {
          categoryMap.set(exp.category, (categoryMap.get(exp.category) || 0) + exp.amountUSD)
        })

        const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0)

        return Array.from(categoryMap.entries())
          .map(([category, spent]) => ({
            category,
            spent,
            percentage: (spent / Math.max(total, 1)) * 100,
          }))
          .sort((a, b) => b.spent - a.spent)
      },

      resetAllData: () => {
        set({
          user: null,
          expenses: [],
          incomes: [],
          budgets: [],
          recurringExpenses: [],
          alerts: [],
          achievements: [],
        })
      },
    }),
    {
      name: "finance-buddy-store",
    },
  ),
)
