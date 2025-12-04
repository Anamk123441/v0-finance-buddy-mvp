export async function getExchangeRate(currency: string): Promise<number> {
  try {
    const response = await fetch(`/api/exchange-rate?currency=${currency}`)

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate")
    }

    const data = await response.json()

    if (data.rate) {
      return data.rate
    }

    throw new Error("Invalid exchange rate response")
  } catch (error) {
    console.error("Error fetching exchange rate:", error)
    throw error
  }
}
