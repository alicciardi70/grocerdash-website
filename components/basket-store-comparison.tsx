import { Button } from "@/components/ui/button"
import { Trophy, ArrowRight, ShoppingCart, MapPin } from "lucide-react"
import Link from "next/link"
import type { BasketItem } from "@/contexts/basket-context"
import { useLocation } from "@/contexts/location-context"

// Update `BasketStoreComparisonProps` to include `stores`
interface BasketStoreComparisonProps {
  basketItems: BasketItem[]
  stores: { id: string; name: string; totalPrice: number }[]
}

export default function BasketStoreComparison({ basketItems, stores }: BasketStoreComparisonProps) {
  const { zipCode } = useLocation()

  if (!basketItems?.length || !stores?.length) {
    return null
  }

  // Calculate total cost and available items for each store
  const storeComparisons = stores.map((store) => {
    // For each store, calculate which items are available in this store
    const itemsInStore = basketItems.map((item) => {
      // First check if this store has a valid price for this item
      let priceInStore = 0

      // If the item was added from this store, use its price
      if (item.store === store.name) {
        priceInStore = item.price
      }
      // Otherwise check if there's a price for this store in the prices array
      else {
        const storePrice = item.prices?.find((p) => p.store === store.name)
        if (storePrice && storePrice.price > 0) {
          priceInStore = storePrice.price
        }
      }

      // Only include items that have a valid price in this store
      return priceInStore > 0
        ? {
            ...item,
            priceInThisStore: priceInStore,
          }
        : null
    }).filter((item): item is (BasketItem & { priceInThisStore: number }) => item !== null)

    const totalCost = itemsInStore.reduce((sum, item) => {
      return sum + item.priceInThisStore * item.quantity
    }, 0)

    return {
      store: store.name,
      totalCost,
      availableItems: itemsInStore.length,
      items: itemsInStore, // Keep track of which items are in this store
    }
  })

  // Sort by total cost (lowest first)
  storeComparisons.sort((a, b) => a.totalCost - b.totalCost)

  const lowestPrice = storeComparisons[0]?.totalCost || 0
  const highestPrice = storeComparisons[storeComparisons.length - 1]?.totalCost || 0
  const totalItems = basketItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Store Comparison</h2>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {zipCode}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {storeComparisons.map((comparison, index) => (
          <div
            key={comparison.store}
            className={`p-4 rounded-lg border ${
              index === 0 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {index === 0 && <Trophy className="h-5 w-5 text-green-600 mr-2" />}
                <div>
                  <h3 className={`font-semibold ${index === 0 ? "text-green-800" : ""}`}>{comparison.store}</h3>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-lg font-bold ${index === 0 ? "text-green-600" : ""}`}>
                  ${comparison.totalCost.toFixed(2)}
                </span>
                {index > 0 && (
                  <p className="text-xs text-red-500">+${(comparison.totalCost - lowestPrice).toFixed(2)}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{comparison.availableItems} items</span>
              </div>
              {index === 0 && <span className="text-green-600 text-xs font-medium">Best Total</span>}
            </div>
          </div>
        ))}
      </div>

      {storeComparisons.length > 1 && (
        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between font-bold mb-2">
            <span>Potential Savings:</span>
            <span className="text-green-600">${(highestPrice - lowestPrice).toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600">
            Shopping at {storeComparisons[0].store} would save you the most for your entire basket.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-blue-800">Your Basket Summary</span>
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-sm text-blue-700">
            <p>
              {totalItems} item{totalItems !== 1 ? "s" : ""} • Best price: ${lowestPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href="/search">
            <Button className="w-full text-sm border border-gray-300 bg-white text-gray-800 hover:bg-gray-100">
              <ArrowRight className="mr-1 h-4 w-4" />
              Add More
            </Button>
          </Link>
          <Link href="/checkout">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm">
              <ShoppingCart className="mr-1 h-4 w-4" />
              Checkout
            </Button>
          </Link>
        </div>

        {/* Remove border from 'Change Store Selection' button */}
        <Link href="/stores">
          <Button className="w-full text-sm bg-white text-gray-800 hover:bg-gray-100">
            Change Store Selection
          </Button>
        </Link>
      </div>
    </div>
  )
}
