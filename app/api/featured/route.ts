import { NextResponse } from "next/server"

export async function GET() {
  try {
    const queries = ["apples", "bananas", "milk", "bread"]
    const results = []

    // Process each query individually to prevent one failure from breaking all
    for (const query of queries) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout per request

        const response = await fetch(`https://api.groceryscout.net/search?query=${encodeURIComponent(query)}`, {
          headers: {
            Accept: "application/json",
            "User-Agent": "GrocerSmart/1.0",
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            results.push(data[0]) // Get first result
            continue
          }
        }

        // If API call failed or returned no data, use fallback
        console.warn(`Using fallback data for ${query}`)
        results.push(getFallbackProduct(query))
      } catch (error) {
        console.warn(`Error fetching ${query}, using fallback:`, error.message)
        results.push(getFallbackProduct(query))
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Featured products error:", error)

    // Return all fallback products if everything fails
    const fallbackProducts = [
      getFallbackProduct("apples"),
      getFallbackProduct("bananas"),
      getFallbackProduct("milk"),
      getFallbackProduct("bread"),
    ]

    return NextResponse.json(fallbackProducts)
  }
}

function getFallbackProduct(query: string) {
  const productData = {
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
  }

  const data = productData[query] || productData.apples

  return {
    match_score: 3,
    match_reason: "✅ Featured product (demo data)",
    prices: [
      {
        store: "Fresh Market",
        price: data.prices[0],
        unit_cost: "$0.50/lb",
      },
      {
        store: "Organic Grocers",
        price: data.prices[1],
        unit_cost: "$0.54/lb",
      },
      {
        store: "Value Supermarket",
        price: data.prices[2],
        unit_cost: "$0.47/lb",
      },
    ],
    metadata: {
      Brand: data.brand,
      UPC: `123456789012${Math.floor(Math.random() * 10)}`,
      UPC_wChkDig: `123456789012${Math.floor(Math.random() * 10)}0`,
      carbohydrates_100g: data.carbs,
      "energy-kcal_100g": data.calories,
      fat_100g: data.fat,
      image_small_url: "/placeholder.svg?height=200&width=200",
      proteins_100g: data.protein,
      sugars_100g: (Number.parseFloat(data.carbs) * 0.7).toFixed(1),
      description: data.description,
    },
  }
}
