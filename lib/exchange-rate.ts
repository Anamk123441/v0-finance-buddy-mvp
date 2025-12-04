export async function getExchangeRate(currency: string): Promise<number> {
  try {
    const response = await fetch(`/api/exchange-rate?currency=${currency}`)

    if (response.ok) {
      const data = await response.json()
      if (data.rate) {
        return data.rate
      }
    }

    return getFallbackRate(currency)
  } catch (error) {
    console.error("Error fetching exchange rate:", error)
    return getFallbackRate(currency)
  }
}

export function getFallbackRate(currency: string): number {
  const fallbackRates: Record<string, number> = {
    INR: 83,
    EUR: 0.92,
    GBP: 0.79,
    CAD: 1.36,
    AUD: 1.52,
    JPY: 149,
    CNY: 7.24,
    SGD: 1.34,
    MXN: 17.2,
    BRL: 4.97,
  }

  return fallbackRates[currency] || 1
}
