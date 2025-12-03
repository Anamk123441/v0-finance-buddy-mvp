"use client"

import type React from "react"
import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Check } from "lucide-react"
import { getExchangeRate } from "@/lib/exchange-rate"

const INCOME_SOURCES = ["Internship", "Part-time Job", "Scholarship", "Freelance", "Stipend", "Other"]

interface AddIncomeModalProps {
  onClose: () => void
}

export function AddIncomeModal({ onClose }: AddIncomeModalProps) {
  const [amount, setAmount] = useState("")
  const [source, setSource] = useState("Internship")
  const [note, setNote] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const user = useAppStore((state) => state.user)
  const addIncome = useAppStore((state) => state.addIncome)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) return

    setIsLoading(true)

    const exchangeRate = user?.homeCurrency ? await getExchangeRate(user.homeCurrency) : 1

    addIncome({
      amountUSD: amountNum,
      source,
      note,
      exchangeRate,
    })

    setShowSuccess(true)
    setIsLoading(false)
    setTimeout(() => {
      setShowSuccess(false)
      setAmount("")
      setNote("")
      setSource("Internship")
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 space-y-4 relative">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-lg font-semibold">Income Added!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Add Income</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
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
                <Label htmlFor="source">Source</Label>
                <select
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  {INCOME_SOURCES.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Input
                  id="note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Weekly paycheck"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Income"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
