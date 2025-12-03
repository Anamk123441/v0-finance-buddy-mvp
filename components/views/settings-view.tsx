"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getExchangeRate } from "@/lib/exchange-rate"

const CURRENCIES = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
]

export function SettingsView() {
  const user = useAppStore((state) => state.user)
  const updateUser = useAppStore((state) => state.updateUser)
  const resetAllData = useAppStore((state) => state.resetAllData)

  const [homeCurrency, setHomeCurrency] = useState(user?.homeCurrency || "INR")
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget?.toString() || "1000")
  const [saved, setSaved] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const exchangeRate = await getExchangeRate(homeCurrency)

      updateUser({
        homeCurrency,
        monthlyBudget: Number.parseFloat(monthlyBudget) || 1000,
        lastKnownExchangeRate: exchangeRate,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetData = () => {
    resetAllData()
  }

  return (
    <div className="p-4 space-y-6">
      <header className="pt-6 pb-2">
        <h1 className="text-3xl font-bold text-balance">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences</p>
      </header>

      <Card className="border-0 shadow-lg">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="home-currency">Home Currency</Label>
            <Select value={homeCurrency} onValueChange={setHomeCurrency}>
              <SelectTrigger id="home-currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name} ({currency.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              All expenses will show USD amount and equivalent in your home currency
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly-budget">Monthly Budget (USD)</Label>
            <Input
              id="monthly-budget"
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              placeholder="1000"
              min="0"
              step="50"
            />
            <p className="text-xs text-muted-foreground">Your target monthly spending limit in USD</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full text-white h-11 rounded-2xl shadow-md font-medium bg-black"
            size="lg"
          >
            {isSaving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </Card>

      <Card className="border-0 shadow-lg border-red-200 dark:border-red-800">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h2 className="font-semibold dark:text-red-100 text-foreground">Reset All Data</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Delete all your expenses, income, bills, and settings. You'll return to the onboarding screen.
              </p>
            </div>
          </div>

          {!showResetConfirm ? (
            <Button
              onClick={() => setShowResetConfirm(true)}
              variant="outline"
              className="w-full h-11 rounded-2xl border-2 border-foreground text-foreground bg-transparent"
            >
              Reset All Data
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium dark:text-red-100 text-center text-foreground">
                Are you sure? This action cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowResetConfirm(false)}
                  className="h-11 rounded-2xl border-2 border-foreground text-foreground bg-transparent"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={handleResetData} className="h-11 rounded-2xl bg-black text-white">
                  Yes, Reset All
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="border-0 shadow-lg">
        <div className="p-6 space-y-4">
          <div className="flex flex-col items-center justify-center py-6">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-4"
            >
              {/* Background circle */}
              <circle cx="60" cy="60" r="55" fill="#DBEAFE" opacity="0.5" />

              {/* Character head */}
              <circle cx="60" cy="45" r="20" fill="#3B82F6" />

              {/* Character body */}
              <ellipse cx="60" cy="80" rx="25" ry="20" fill="#3B82F6" />

              {/* Eyes */}
              <circle cx="53" cy="42" r="3" fill="white" />
              <circle cx="67" cy="42" r="3" fill="white" />

              {/* Smile */}
              <path d="M52 48 Q60 53 68 48" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Dollar coin left */}
              <circle cx="30" cy="70" r="12" fill="#FB923C" />
              <text x="30" y="75" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
                $
              </text>

              {/* Dollar coin right */}
              <circle cx="90" cy="70" r="12" fill="#FB923C" />
              <text x="90" y="75" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
                $
              </text>

              {/* Piggy bank ears */}
              <circle cx="45" cy="35" r="5" fill="#3B82F6" opacity="0.8" />
              <circle cx="75" cy="35" r="5" fill="#3B82F6" opacity="0.8" />

              {/* Sparkles */}
              <path d="M25 30 L26 32 L28 33 L26 34 L25 36 L24 34 L22 33 L24 32 Z" fill="#FB923C" />
              <path d="M95 40 L96 42 L98 43 L96 44 L95 46 L94 44 L92 43 L94 42 Z" fill="#FB923C" />
            </svg>
          </div>

          <h2 className="font-semibold text-center">About</h2>
          <div className="text-sm text-muted-foreground space-y-2 text-center">
            <p className="font-medium text-foreground">Finance Buddy v1.0</p>
            <p>Designed for international master's students in the U.S.</p>
            <p className="text-xs">Track expenses, manage budgets, and stay motivated to save smart.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
