export async function getExchangeRate(currency: string): Promise<number> {
  try {
    // Try Open Exchange Rates API first if API key is available
    const apiKey = process.env.NEXT_PUBLIC_OPENEXCHANGERATES_API_KEY

    if (apiKey) {
      // Using Open Exchange Rates API with the provided API key
      const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${apiKey}&symbols=${currency}`)
      const data = await response.json()

      if (data.rates && data.rates[currency]) {
        return data.rates[currency]
      }
    } else {
      // Fallback to free exchangerate-api.com if no API key is configured
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
      const data = await response.json()

      if (data.rates && data.rates[currency]) {
        return data.rates[currency]
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
