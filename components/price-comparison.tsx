import { Check } from "lucide-react"

interface PriceComparisonProps {
  prices: {
    store: string
    price: number
    unitCost?: string
  }[]
  unit: string
}

export default function PriceComparison({ prices, unit }: PriceComparisonProps) {
  // Sort prices from lowest to highest
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price)
  const lowestPrice = sortedPrices[0].price

  return (
    <div className="space-y-2">
      {sortedPrices.map((price, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-3 rounded-md ${
            index === 0 ? "bg-green-50 border border-green-100" : "bg-gray-50"
          }`}
        >
          <div className="flex items-center">
            {index === 0 && <Check className="h-4 w-4 text-green-600 mr-2" />}
            <span className={index === 0 ? "font-medium" : ""}>{price.store}</span>
          </div>
          <div className="text-right">
            <div className="flex items-center">
              <span className={index === 0 ? "font-medium text-green-600" : ""}>${price.price.toFixed(2)}</span>
              {index > 0 && (
                <span className="text-xs text-red-500 ml-2">+${(price.price - lowestPrice).toFixed(2)}</span>
              )}
            </div>
            {price.unitCost && <div className="text-xs text-gray-500 mt-1">{price.unitCost}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
