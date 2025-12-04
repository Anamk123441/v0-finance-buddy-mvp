import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const currency = searchParams.get("currency")

  if (!currency) {
    return NextResponse.json({ error: "Currency parameter required" }, { status: 400 })
  }

  try {
    const apiKey = process.env.OPENEXCHANGERATES_API_KEY

    if (apiKey) {
      // Try Open Exchange Rates API first
      const oxrResponse = await fetch(
        `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&symbols=${currency}&base=USD`,
      )

      if (oxrResponse.ok) {
        const data = await oxrResponse.json()
        if (data.rates && data.rates[currency]) {
          return NextResponse.json({ rate: data.rates[currency] })
        }
      }
    }

    // Fallback to exchangerate-api.com (free, no API key required)
    const fallbackResponse = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`)

    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json()
      if (data.rates && data.rates[currency]) {
        return NextResponse.json({ rate: data.rates[currency] })
      }
    }

    // If both APIs fail, return fallback rates
    const fallbackRates: Record<string, number> = {
      INR: 83,
      GBP: 0.79,
      CAD: 1.36,
      AUD: 1.52,
      SGD: 1.34,
      EUR: 0.92,
      JPY: 149,
      CNY: 7.24,
      MXN: 17.2,
      BRL: 4.97,
    }

    const rate = fallbackRates[currency] || 1
    return NextResponse.json({ rate })
  } catch (error) {
    console.error("Exchange rate fetch error:", error)

    // Return fallback rates on error
    const fallbackRates: Record<string, number> = {
      INR: 83,
      GBP: 0.79,
      CAD: 1.36,
      AUD: 1.52,
      SGD: 1.34,
      EUR: 0.92,
      JPY: 149,
      CNY: 7.24,
      MXN: 17.2,
      BRL: 4.97,
    }

    const rate = fallbackRates[currency] || 1
    return NextResponse.json({ rate })
  }
}
