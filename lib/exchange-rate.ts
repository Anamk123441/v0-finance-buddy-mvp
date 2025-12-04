export async function getExchangeRate(currency: string): Promise<number> {
  try {
    // Using exchangerate-api.com free tier (no API key required for basic usage)
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
    const data = await response.json()

    if (data.rates && data.rates[currency]) {
      return data.rates[currency]
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
