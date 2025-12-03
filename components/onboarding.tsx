"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"

const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "MXN", symbol: "Mex$", name: "Mexican Peso" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
]

type OnboardingStep = "welcome" | "currency" | "budget" | "sample"

export function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>("welcome")
  const [selectedCurrency, setSelectedCurrency] = useState<string>("")
  const [monthlyBudget, setMonthlyBudget] = useState<string>("")
  const [sampleAmount, setSampleAmount] = useState<string>("")
  const [sampleCategory, setSampleCategory] = useState<string>("Food")

  const initializeUser = useAppStore((state) => state.initializeUser)
  const addExpense = useAppStore((state) => state.addExpense)

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency)
    setStep("budget")
  }

  const handleBudgetSet = () => {
    if (!monthlyBudget || !selectedCurrency) return

    initializeUser({
      homeCurrency: selectedCurrency,
      monthlyBudget: Number.parseFloat(monthlyBudget),
    })

    setStep("sample")
  }

  const handleSampleExpense = () => {
    if (!sampleAmount) return

    const rate = 83 // Placeholder rate for demo
    addExpense({
      amountUSD: Number.parseFloat(sampleAmount),
      category: sampleCategory,
      note: "Welcome expense",
      exchangeRate: rate,
    })

    useAppStore.setState((state) => ({
      user: { ...state.user!, onboardingCompleted: true },
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === "welcome" && (
          <Card className="border-0 shadow-lg">
            <div className="p-8 text-center space-y-6">
              <div className="flex justify-center mb-4">
                <svg width="140" height="140" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
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

              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-balance">My Finance Buddy</h1>
                <p className="text-muted-foreground text-balance">
                  Stay on top of your monthly spending, no matter where you are in the world
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 space-y-3 text-left border border-blue-100">
                <p className="text-sm font-semibold text-blue-900">Designed for international students</p>
                <ul className="text-sm space-y-2 text-blue-800">
                  <li>✓ Track spending in USD + home currency</li>
                  <li>✓ Monthly budget clarity</li>
                  <li>✓ Motivational insights</li>
                  <li>✓ Fast, simple expense logging</li>
                </ul>
              </div>

              <Button
                onClick={() => setStep("currency")}
                className="w-full bg-blue-600 text-white h-12 rounded-2xl shadow-md"
                size="lg"
              >
                Let's Get Started
              </Button>
            </div>
          </Card>
        )}

        {step === "currency" && (
          <Card className="border-0 shadow-lg">
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Where are you from?</h2>
                <p className="text-sm text-muted-foreground">
                  Select your home currency to see how much you're spending
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => handleCurrencySelect(curr.code)}
                    aria-label={`Select ${curr.name}`}
                    className={`p-3 rounded-xl border-2 transition text-left text-sm font-medium ${
                      selectedCurrency === curr.code ? "border-blue-500 bg-blue-50" : "border-slate-200"
                    }`}
                  >
                    <div>{curr.symbol}</div>
                    <div className="text-xs mt-1 truncate">{curr.code}</div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {step === "budget" && (
          <Card className="border-0 shadow-lg">
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Set Your Monthly Budget</h2>
                <p className="text-sm text-muted-foreground">How much can you spend on average per month (in USD)?</p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <label htmlFor="budget-input" className="sr-only">
                    Monthly Budget in USD
                  </label>
                  <span className="absolute left-3 top-3 text-lg font-semibold text-muted-foreground">$</span>
                  <Input
                    id="budget-input"
                    type="number"
                    placeholder="2500"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    className="pl-8 text-lg rounded-xl"
                  />
                </div>
                <p className="text-xs text-muted-foreground">This is just a guideline. You can change it anytime.</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep("currency")} variant="outline" className="flex-1 rounded-xl">
                  Back
                </Button>
                <Button
                  onClick={handleBudgetSet}
                  disabled={!monthlyBudget}
                  className="flex-1 bg-blue-600 text-white rounded-xl"
                >
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        )}

        {step === "sample" && (
          <Card className="border-0 shadow-lg">
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Log Your First Expense</h2>
                <p className="text-sm text-muted-foreground">Let's add a sample expense to see how it works</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="sample-amount" className="text-sm font-medium">
                    Amount (USD)
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-3 text-lg font-semibold">$</span>
                    <Input
                      id="sample-amount"
                      type="number"
                      placeholder="12.50"
                      value={sampleAmount}
                      onChange={(e) => setSampleAmount(e.target.value)}
                      className="pl-8 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sample-category" className="text-sm font-medium">
                    Category
                  </label>
                  <select
                    id="sample-category"
                    value={sampleCategory}
                    onChange={(e) => setSampleCategory(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border rounded-xl bg-background"
                  >
                    <option>Food</option>
                    <option>Groceries</option>
                    <option>Transport</option>
                    <option>Utilities</option>
                    <option>Shopping</option>
                    <option>School</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep("budget")} variant="outline" className="flex-1 rounded-xl">
                  Back
                </Button>
                <Button
                  onClick={handleSampleExpense}
                  disabled={!sampleAmount}
                  className="flex-1 bg-blue-600 text-white rounded-xl"
                >
                  Complete Setup
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
