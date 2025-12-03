"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/lib/store"
import { X, Check, ChevronDown } from "lucide-react"
import { getExchangeRate } from "@/lib/exchange-rate"

const CATEGORIES = ["Food", "Groceries", "Rent", "Transport", "Utilities", "School", "Shopping", "Misc"]

interface AddExpenseModalProps {
  onClose: () => void
}

export function AddExpenseModal({ onClose }: AddExpenseModalProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [note, setNote] = useState("")
  const [currencyType, setCurrencyType] = useState<"USD" | "HOME">("USD")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const user = useAppStore((state) => state.user)
  const addExpense = useAppStore((state) => state.addExpense)

  useEffect(() => {
    console.log("[v0] AddExpenseModal mounted")
    setAmount("")
    setNote("")
    setCategory("Food")
    setCurrencyType("USD")
    setShowSuccess(false)
    setIsLoading(false)

    return () => {
      console.log("[v0] AddExpenseModal unmounted")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted, amount:", amount)

    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      console.log("[v0] Invalid amount")
      return
    }

    setIsLoading(true)
    console.log("[v0] Fetching exchange rate...")

    const exchangeRate = user?.homeCurrency ? await getExchangeRate(user.homeCurrency) : 1
    console.log("[v0] Exchange rate:", exchangeRate)

    if (currencyType === "USD") {
      addExpense({
        amountUSD: amountValue,
        category,
        note,
        exchangeRate,
      })
    } else {
      addExpense({
        amountUSD: amountValue / exchangeRate,
        category,
        note,
        exchangeRate,
      })
    }

    console.log("[v0] Expense added, showing success")
    setShowSuccess(true)
    setIsLoading(false)

    setTimeout(() => {
      console.log("[v0] Closing modal after success")
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 space-y-4 relative">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-lg font-semibold">Expense Added!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Add Expense</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <div className="flex gap-2">
                  {(["USD", "HOME"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCurrencyType(type)}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 font-medium text-sm transition ${
                        currencyType === type
                          ? "border-foreground bg-muted text-foreground"
                          : "border-input bg-background"
                      }`}
                    >
                      {type === "USD" ? "USD $" : user?.homeCurrency}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="relative">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background appearance-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Input
                  id="note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Bubble tea with friends"
                />
              </div>

              <Button type="submit" className="w-full bg-black text-white" size="lg" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Expense"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
