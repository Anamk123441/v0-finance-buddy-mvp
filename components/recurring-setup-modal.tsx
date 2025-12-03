"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/lib/store"
import { X, Check } from "lucide-react"

const CATEGORIES = ["Food", "Groceries", "Rent", "Transport", "Utilities", "School", "Shopping", "Misc"]

interface RecurringSetupModalProps {
  onClose: () => void
}

export function RecurringSetupModal({ onClose }: RecurringSetupModalProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDay, setDueDay] = useState("1")
  const [category, setCategory] = useState("Utilities")
  const [showSuccess, setShowSuccess] = useState(false)

  const addRecurringExpense = useAppStore((state) => state.addRecurringExpense)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = Number.parseFloat(amount)
    const dueDayNum = Number.parseInt(dueDay)

    if (!name || isNaN(amountNum) || amountNum <= 0 || isNaN(dueDayNum)) return

    addRecurringExpense({
      name,
      amountUSD: amountNum,
      dueDay: dueDayNum,
      category,
    })

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setName("")
      setAmount("")
      setDueDay("1")
      setCategory("Utilities")
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 space-y-4 relative">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-lg font-semibold">Recurring Expense Added!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Add Recurring Expense</h2>
              <button onClick={onClose} className="text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Expense Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Rent, Netflix, Phone Bill"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDay">Due Day of Month</Label>
                <Input
                  id="dueDay"
                  type="number"
                  min="1"
                  max="31"
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full bg-black text-white" size="lg">
                Add Recurring Expense
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
