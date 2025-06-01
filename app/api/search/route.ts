import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(`https://api.groceryscout.net/search?query=${encodeURIComponent(query)}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "GrocerSmart/1.0",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(`GroceryScout API returned ${response.status} for query: ${query}`)
      // Return fallback data instead of throwing error
      const fallbackData = getFallbackData(query)
      return NextResponse.json(fallbackData)
    }

    const data = await response.json()

    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.warn("API returned non-array data, using fallback")
      const fallbackData = getFallbackData(query)
      return NextResponse.json(fallbackData)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)

    // Always return fallback data on any error
    const fallbackData = getFallbackData(query)
    return NextResponse.json(fallbackData)
  }
}

function getFallbackData(query: string) {
  const baseProducts = {
    apples: {
      brand: "Fresh Farm",
      calories: "95",
      carbs: "25.0",
      protein: "0.5",
      fat: "0.3",
      prices: ["3.99", "4.29", "3.79"],
      description: "Fresh Farm Apples - Premium Quality",
    },
    bananas: {
      brand: "Tropical Best",
      calories: "105",
      carbs: "27.0",
      protein: "1.3",
      fat: "0.4",
      prices: ["2.99", "3.29", "2.79"],
      description: "Tropical Best Bananas - Sweet & Fresh",
    },
    milk: {
      brand: "Dairy Fresh",
      calories: "150",
      carbs: "12.0",
      protein: "8.0",
      fat: "8.0",
      prices: ["3.99", "4.29", "3.79"],
      description: "Dairy Fresh Whole Milk - 1 Gallon",
    },
    bread: {
      brand: "Bakery Best",
      calories: "80",
      carbs: "15.0",
      protein: "3.0",
      fat: "0.5",
      prices: ["2.49", "2.79", "2.29"],
      description: "Bakery Best Whole Wheat Bread",
    },
    crackers: {
      brand: "Nabisco",
      calories: "419",
      carbs: "77.4",
      protein: "6.5",
      fat: "9.7",
      prices: ["4.49", "5.39", "5.89"],
      description: "Nabisco Original Graham Crackers, 14.4 OZ BOX",
    },
  }

  // Find matching product or use default
  const productKey = Object.keys(baseProducts).find(
    (key) => query.toLowerCase().includes(key) || key.includes(query.toLowerCase()),
  )

  const productData = baseProducts[productKey] || baseProducts.apples

  return [
    {
      match_score: 3,
      match_reason: "✅ Exact match (demo data)",
      prices: [
        {
          store: "Fresh Market",
          price: productData.prices[0],
          unit_cost: "$0.50/lb",
        },
        {
          store: "Organic Grocers",
          price: productData.prices[1],
          unit_cost: "$0.54/lb",
        },
        {
          store: "Value Supermarket",
          price: productData.prices[2],
          unit_cost: "$0.47/lb",
        },
      ],
      metadata: {
        Brand: productData.brand,
        UPC: `123456789012${Math.floor(Math.random() * 10)}`,
        UPC_wChkDig: `123456789012${Math.floor(Math.random() * 10)}0`,
        carbohydrates_100g: productData.carbs,
        "energy-kcal_100g": productData.calories,
        fat_100g: productData.fat,
        image_small_url: "/placeholder.svg?height=200&width=200",
        proteins_100g: productData.protein,
        sugars_100g: (Number.parseFloat(productData.carbs) * 0.7).toFixed(1),
        description: productData.description,
      },
    },
    {
      match_score: 2,
      match_reason: "🟡 Partial match (demo data)",
      prices: [
        {
          store: "Fresh Market",
          price: (Number.parseFloat(productData.prices[0]) + 0.5).toFixed(2),
          unit_cost: "$0.56/lb",
        },
        {
          store: "Organic Grocers",
          price: (Number.parseFloat(productData.prices[1]) + 0.7).toFixed(2),
          unit_cost: "$0.62/lb",
        },
        {
          store: "Value Supermarket",
          price: (Number.parseFloat(productData.prices[2]) + 0.4).toFixed(2),
          unit_cost: "$0.52/lb",
        },
      ],
      metadata: {
        Brand: "Organic Choice",
        UPC: `123456789013${Math.floor(Math.random() * 10)}`,
        UPC_wChkDig: `123456789013${Math.floor(Math.random() * 10)}0`,
        carbohydrates_100g: (Number.parseFloat(productData.carbs) * 0.9).toFixed(1),
        "energy-kcal_100g": (Number.parseFloat(productData.calories) * 0.9).toFixed(0),
        fat_100g: (Number.parseFloat(productData.fat) * 0.8).toFixed(1),
        image_small_url: "/placeholder.svg?height=200&width=200",
        proteins_100g: (Number.parseFloat(productData.protein) * 0.9).toFixed(1),
        sugars_100g: (Number.parseFloat(productData.carbs) * 0.6).toFixed(1),
        description: `Organic ${productData.description.split(" ").slice(1).join(" ")}`,
      },
    },
  ]
}
