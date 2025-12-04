import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const currency = searchParams.get("currency")

  if (!currency) {
    return NextResponse.json({ error: "Currency parameter required" }, { status: 400 })
  }

  try {
    const apiKey = process.env.OPENEXCHANGERATES_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const oxrResponse = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&symbols=${currency}&base=USD`,
    )

    if (!oxrResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch exchange rate" }, { status: 500 })
    }

    const data = await oxrResponse.json()

    if (data.rates && data.rates[currency]) {
      return NextResponse.json({ rate: data.rates[currency] })
    }

    return NextResponse.json({ error: "Currency not found" }, { status: 404 })
  } catch (error) {
    console.error("Exchange rate fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch exchange rate" }, { status: 500 })
  }
}
