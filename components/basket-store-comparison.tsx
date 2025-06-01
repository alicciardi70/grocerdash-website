import { Button } from "@/components/ui/button"
import { Trophy, ArrowRight, ShoppingCart, MapPin } from "lucide-react"
import Link from "next/link"
import type { BasketItem } from "@/contexts/basket-context"
import { useLocation } from "@/contexts/location-context"

interface BasketStoreComparisonProps {
  basketItems: BasketItem[]
}

export default function BasketStoreComparison({ basketItems }: BasketStoreComparisonProps) {
  const { selectedStores, zipCode } = useLocation()

  // If no items, don't render anything
  if (!basketItems || basketItems.length === 0) {
    return null
  }

  // Calculate what each store would cost for ALL items in basket
  const storeComparisons = selectedStores.map((store) => {
    let totalCost = 0
    let availableItems = 0
    let unavailableItems = 0

    basketItems.forEach((item) => {
      // Check if this store has this product (simulate by checking if item was added from this store)
      const itemAvailableAtStore = item.store === store.name

      if (itemAvailableAtStore) {
        totalCost += item.price * item.quantity
        availableItems += item.quantity
      } else {
        // Simulate price for unavailable items (would be fetched from API in real app)
        const estimatedPrice = item.price * (0.95 + Math.random() * 0.1) // ±5% variation
        totalCost += estimatedPrice * item.quantity
        unavailableItems += item.quantity
      }
    })

    return {
      store,
      totalCost,
      availableItems,
      unavailableItems,
      totalItems: availableItems + unavailableItems,
      hasAllItems: unavailableItems === 0,
    }
  })

  // Sort by total cost (lowest first)
  storeComparisons.sort((a, b) => a.totalCost - b.totalCost)

  const lowestPrice = storeComparisons[0]?.totalCost || 0
  const highestPrice = Math.max(...storeComparisons.map((sc) => sc.totalCost))
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
            key={comparison.store.id}
            className={`p-4 rounded-lg border ${
              index === 0 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {index === 0 && <Trophy className="h-5 w-5 text-green-600 mr-2" />}
                <div>
                  <h3 className={`font-semibold ${index === 0 ? "text-green-800" : ""}`}>{comparison.store.name}</h3>
                  <p className="text-xs text-gray-500">{comparison.store.distance}</p>
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
                <span className="text-gray-600">{comparison.totalItems} items</span>
                {comparison.hasAllItems ? (
                  <span className="text-green-600 text-xs">✓ All available</span>
                ) : (
                  <span className="text-orange-600 text-xs">{comparison.unavailableItems} estimated</span>
                )}
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
            Shopping at {storeComparisons[0].store.name} would save you the most for your entire basket.
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
            <Button variant="outline" className="w-full text-sm">
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

        <Link href="/stores">
          <Button variant="ghost" className="w-full text-sm text-gray-600">
            Change Store Selection
          </Button>
        </Link>
      </div>
    </div>
  )
}
