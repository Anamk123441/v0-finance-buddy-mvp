"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { ChevronDown, Check } from "lucide-react"

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
  const [sampleNote, setSampleNote] = useState<string>("")

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

  const handleSampleExpense = async () => {
    if (!sampleAmount) return

    const { getExchangeRate } = await import("@/lib/exchange-rate")
    const rate = await getExchangeRate(selectedCurrency)

    addExpense({
      amountUSD: Number.parseFloat(sampleAmount),
      category: sampleCategory,
      note: sampleNote || "Welcome expense",
      exchangeRate: rate,
    })

    useAppStore.setState((state) => ({
      user: { ...state.user!, onboardingCompleted: true },
    }))
  }

  const handleSkipSampleExpense = () => {
    useAppStore.setState((state) => ({
      user: { ...state.user!, onboardingCompleted: true },
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === "welcome" && (
          <Card className="border-0 shadow-xl">
            <div className="p-8 text-center space-y-6">
              <div className="flex justify-center mb-4">
                <svg width="140" height="140" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="55" fill="#DBEAFE" opacity="0.5">
                    <animate attributeName="r" values="55;58;55" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.7;0.5" dur="3s" repeatCount="indefinite" />
                  </circle>

                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,-3; 0,0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <circle cx="60" cy="45" r="20" fill="#3B82F6" />
                    <circle cx="53" cy="42" r="3" fill="white" />
                    <circle cx="67" cy="42" r="3" fill="white" />
                    <path d="M52 48 Q60 53 68 48" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <circle cx="45" cy="35" r="5" fill="#3B82F6" opacity="0.8" />
                    <circle cx="75" cy="35" r="5" fill="#3B82F6" opacity="0.8" />
                  </g>

                  <ellipse cx="60" cy="80" rx="25" ry="20" fill="#3B82F6">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,-3; 0,0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </ellipse>

                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,-5; 0,0"
                      dur="2.5s"
                      begin="0.2s"
                      repeatCount="indefinite"
                    />
                    <circle cx="30" cy="70" r="12" fill="#FB923C" />
                    <text x="30" y="75" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
                      $
                    </text>
                  </g>

                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,-5; 0,0"
                      dur="2.5s"
                      begin="0.4s"
                      repeatCount="indefinite"
                    />
                    <circle cx="90" cy="70" r="12" fill="#FB923C" />
                    <text x="90" y="75" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
                      $
                    </text>
                  </g>

                  <g>
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                    <path d="M25 30 L26 32 L28 33 L26 34 L25 36 L24 34 L22 33 L24 32 Z" fill="#FB923C" />
                  </g>
                  <g>
                    <animate
                      attributeName="opacity"
                      values="1;0.3;1"
                      dur="1.5s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                    <path d="M95 40 L96 42 L98 43 L96 44 L95 46 L94 44 L92 43 L94 42 Z" fill="#FB923C" />
                  </g>
                </svg>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-balance text-primary">My Finance Buddy</h1>
                <p className="text-sm text-muted-foreground text-balance leading-relaxed">
                  Manage your money confidently as you navigate life in a new country.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 space-y-3 text-left border border-blue-200/50 shadow-sm">
                <p className="text-sm font-bold text-black">Designed for international students</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-foreground">
                    <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-300">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span>Track spending in USD + home currency</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground">
                    <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-300">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span>Monthly budget clarity</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground">
                    <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-300">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span>Fast, simple expense &amp; income logging. </span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => setStep("currency")}
                className="w-full bg-black text-white h-12 rounded-2xl shadow-md text-base font-semibold"
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
                <h2 className="text-2xl font-bold mb-2">What is your home currency?</h2>
                <p className="text-sm text-muted-foreground">
                  See your income and expenses in USD, and in the currency you’re most familiar with, perfect for
                  keeping track while studying abroad.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => handleCurrencySelect(curr.code)}
                    aria-label={`Select ${curr.name}`}
                    className={`p-3 rounded-xl border-2 transition text-left text-sm font-medium ${
                      selectedCurrency === curr.code ? "border-black bg-muted" : "border-slate-200"
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
                <p className="text-sm text-muted-foreground">How much do you spend on average per month (in USD)? </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <label htmlFor="budget-input" className="sr-only">
                    Monthly Budget in USD
                  </label>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                    $
                  </span>
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
                  className="flex-1 bg-black text-white rounded-xl"
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold">$</span>
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
                  <div className="relative mt-2">
                    <select
                      id="sample-category"
                      value={sampleCategory}
                      onChange={(e) => setSampleCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background appearance-none"
                    >
                      <option>Food</option>
                      <option>Groceries</option>
                      <option>Transport</option>
                      <option>Utilities</option>
                      <option>Shopping</option>
                      <option>School</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label htmlFor="sample-note" className="text-sm font-medium">
                    Note (optional)
                  </label>
                  <div className="mt-2">
                    <Input
                      id="sample-note"
                      type="text"
                      placeholder="e.g., Bubble tea with friends"
                      value={sampleNote}
                      onChange={(e) => setSampleNote(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button onClick={() => setStep("budget")} variant="outline" className="flex-1 rounded-xl">
                    Back
                  </Button>
                  <Button
                    onClick={handleSampleExpense}
                    disabled={!sampleAmount}
                    className="flex-1 bg-black text-white rounded-xl"
                  >
                    Complete Setup
                  </Button>
                </div>
                <div className="flex justify-end">
                  <button onClick={handleSkipSampleExpense} className="text-sm text-muted-foreground underline">
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
