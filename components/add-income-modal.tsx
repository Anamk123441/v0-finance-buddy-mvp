"use client"

import type React from "react"
import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ChevronDown } from "lucide-react"
import { getExchangeRate } from "@/lib/exchange-rate"

const INCOME_SOURCES = ["Internship", "Part-time Job", "Scholarship", "Freelance", "Stipend", "Other"]

interface AddIncomeModalProps {
  onClose: () => void
}

function Confetti() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 opacity-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            backgroundColor: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#FF8B94", "#A8E6CF"][Math.floor(Math.random() * 5)],
            animation: `confetti-fall ${2 + Math.random() * 2}s linear forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(600px) rotate(720deg);
          }
        }
      `}</style>
    </div>
  )
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
          <>
            <Confetti />
            <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in duration-300">
              <div className="mb-4 animate-in zoom-in duration-500">
                <svg width="100" height="100" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background circle */}
                  <circle cx="60" cy="60" r="55" fill="#DBEAFE" opacity="0.3" />

                  {/* Character body */}
                  <circle cx="60" cy="45" r="20" fill="#3B82F6" />
                  <ellipse cx="60" cy="80" rx="25" ry="20" fill="#3B82F6" />

                  {/* Happy eyes */}
                  <circle cx="53" cy="42" r="3" fill="white" />
                  <circle cx="67" cy="42" r="3" fill="white" />

                  {/* Big smile */}
                  <path d="M50 48 Q60 56 70 48" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                  {/* Celebratory coins */}
                  <circle cx="30" cy="50" r="10" fill="#FB923C" />
                  <text x="30" y="54" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
                    $
                  </text>

                  <circle cx="90" cy="50" r="10" fill="#FB923C" />
                  <text x="90" y="54" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
                    $
                  </text>

                  {/* Sparkles */}
                  <path d="M25 25 L26 27 L28 28 L26 29 L25 31 L24 29 L22 28 L24 27 Z" fill="#FB923C" />
                  <path d="M95 30 L96 32 L98 33 L96 34 L95 36 L94 34 L92 33 L94 32 Z" fill="#FB923C" />
                </svg>
              </div>
              <p className="text-lg font-semibold">Income Added!</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Add Income</h2>
              <button onClick={onClose} className="text-muted-foreground">
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
                  className="focus:border-black focus:ring-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <div className="relative">
                  <select
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background appearance-none"
                  >
                    {INCOME_SOURCES.map((src) => (
                      <option key={src} value={src}>
                        {src}
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
                  placeholder="e.g., Weekly paycheck"
                  className="focus:border-black focus:ring-black"
                />
              </div>

              <Button type="submit" className="w-full bg-black text-white" size="lg" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Income"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
