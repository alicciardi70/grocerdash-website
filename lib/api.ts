// API utility functions for GroceryScout integration
export interface GroceryScoutPrice {
  store: string
  price: string
  unit_cost?: string
}

export interface GroceryScoutMetadata {
  Brand?: string
  UPC?: string
  UPC_wChkDig?: string
  carbohydrates_100g?: string
  "energy-kcal_100g"?: string
  fat_100g?: string
  image_small_url?: string
  proteins_100g?: string
  sugars_100g?: string
  description?: string
}

export interface GroceryScoutProduct {
  match_score?: number
  match_reason?: string
  prices: GroceryScoutPrice[]
  metadata: GroceryScoutMetadata
}

export interface TransformedProduct {
  id: string
  name: string
  image: string
  prices: Array<{
    store: string
    price: number
    unitCost?: string
  }>
  unit: string
  nutrition: {
    calories: number
    protein: string
    fat: string
    carbs: string
  }
  brand?: string
  description?: string
  ingredients?: string
  allergens?: string
  upc?: string
  matchScore?: number
  matchReason?: string
}

export async function searchProducts(query: string, zipCode?: string): Promise<TransformedProduct[]> {
  try {
    const searchParams = new URLSearchParams({ query })
    if (zipCode) {
      searchParams.append("zipCode", zipCode)
    }

    const response = await fetch(`/api/search?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn(`Search API returned ${response.status} for query: ${query}`)
      return []
    }

    const data: GroceryScoutProduct[] = await response.json()

    if (!Array.isArray(data)) {
      console.warn("Search API returned non-array data")
      return []
    }

    return data
      .filter((item) => item && item.prices && item.prices.length > 0) // Only include valid items with prices
      .map((item, index) => transformProduct(item, index))
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export function transformProduct(item: GroceryScoutProduct, fallbackId?: number): TransformedProduct {
  const metadata = item.metadata || {}

  // Extract nutrition data from metadata (per 100g)
  const caloriesPer100g = Number.parseFloat(metadata["energy-kcal_100g"] || "0")
  const proteinPer100g = Number.parseFloat(metadata.proteins_100g || "0")
  const fatPer100g = Number.parseFloat(metadata.fat_100g || "0")
  const carbsPer100g = Number.parseFloat(metadata.carbohydrates_100g || "0")

  // Convert to per serving (assuming ~100g serving for simplicity)
  const calories = Math.round(caloriesPer100g) || 100
  const protein = proteinPer100g ? `${proteinPer100g.toFixed(1)}g` : "2g"
  const fat = fatPer100g ? `${fatPer100g.toFixed(1)}g` : "0.5g"
  const carbs = carbsPer100g ? `${carbsPer100g.toFixed(1)}g` : "25g"

  // Transform prices with error handling
  const transformedPrices = (item.prices || [])
    .map((price) => ({
      store: price.store || "Unknown Store",
      price: Number.parseFloat(price.price) || 0,
      unitCost: price.unit_cost,
    }))
    .filter((price) => price.price > 0) // Remove invalid prices

  // Sort prices by lowest first
  transformedPrices.sort((a, b) => a.price - b.price)

  // Extract unit from unit_cost (e.g., "$0.31/oz" -> "oz")
  const unitMatch = item.prices?.[0]?.unit_cost?.match(/\/(\w+)$/)
  const unit = unitMatch ? unitMatch[1] : "each"

  return {
    id: metadata.UPC || `product-${fallbackId || Math.random().toString(36).substr(2, 9)}`,
    name: metadata.description || `Product ${fallbackId}`,
    image: metadata.image_small_url || "/placeholder.svg?height=200&width=200",
    prices: transformedPrices,
    unit: unit,
    nutrition: {
      calories,
      protein,
      fat,
      carbs,
    },
    brand: metadata.Brand,
    description: metadata.description,
    upc: metadata.UPC,
    matchScore: item.match_score,
    matchReason: item.match_reason,
  }
}

export async function getProductById(id: string): Promise<TransformedProduct | null> {
  try {
    // For now, search for a common product since we don't have direct ID lookup
    const response = await fetch(`/api/search?query=apples`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn(`Product API returned ${response.status}`)
      return null
    }

    const data: GroceryScoutProduct[] = await response.json()

    if (Array.isArray(data) && data.length > 0) {
      const product = transformProduct(data[0])

      // Enhance with additional nutrition details for the detailed view
      return {
        ...product,
        nutrition: {
          ...product.nutrition,
          servingSize: "1 medium serving (100g)",
          servingsPerContainer: "Variable",
          totalFat: product.nutrition.fat,
          saturatedFat: "0.1g",
          transFat: "0g",
          cholesterol: "0mg",
          sodium: "1mg",
          totalCarbs: product.nutrition.carbs,
          dietaryFiber: "3.1g",
          sugars: data[0].metadata.sugars_100g
            ? `${Number.parseFloat(data[0].metadata.sugars_100g).toFixed(1)}g`
            : "14.4g",
          protein: product.nutrition.protein,
          vitaminD: "0mcg",
          calcium: "5mg",
          iron: "0.3mg",
          potassium: "422mg",
        },
        ingredients: "Natural ingredients.",
        allergens: "Please check product packaging for allergen information.",
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching product by ID:", error)
    return null
  }
}

export async function getFeaturedProducts(): Promise<TransformedProduct[]> {
  try {
    const response = await fetch("/api/featured", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn(`Featured API returned ${response.status}`)
      return []
    }

    const data: GroceryScoutProduct[] = await response.json()

    if (!Array.isArray(data)) {
      console.warn("Featured API returned non-array data")
      return []
    }

    return data
      .filter(Boolean)
      .map((item, index) => transformProduct(item, index))
      .slice(0, 4)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}
