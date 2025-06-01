import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const products = [
  {
    id: 1,
    name: "Organic Bananas",
    image: "/placeholder.svg?height=200&width=200",
    price: 2.99,
    unit: "bunch",
    store: "Fresh Market",
  },
  {
    id: 2,
    name: "Avocado",
    image: "/placeholder.svg?height=200&width=200",
    price: 1.49,
    unit: "each",
    store: "Organic Grocers",
  },
  {
    id: 3,
    name: "Whole Milk",
    image: "/placeholder.svg?height=200&width=200",
    price: 3.99,
    unit: "gallon",
    store: "Value Supermarket",
  },
  {
    id: 4,
    name: "Cage-Free Eggs",
    image: "/placeholder.svg?height=200&width=200",
    price: 4.49,
    unit: "dozen",
    store: "Farmers Direct",
  },
  {
    id: 5,
    name: "Sourdough Bread",
    image: "/placeholder.svg?height=200&width=200",
    price: 5.99,
    unit: "loaf",
    store: "Fresh Market",
  },
  {
    id: 6,
    name: "Strawberries",
    image: "/placeholder.svg?height=200&width=200",
    price: 3.99,
    unit: "16 oz",
    store: "Farmers Direct",
  },
  {
    id: 7,
    name: "Chicken Breast",
    image: "/placeholder.svg?height=200&width=200",
    price: 6.99,
    unit: "lb",
    store: "Value Supermarket",
  },
  {
    id: 8,
    name: "Spinach",
    image: "/placeholder.svg?height=200&width=200",
    price: 2.49,
    unit: "bunch",
    store: "Organic Grocers",
  },
]

export default function PopularItems() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Popular Items</h2>
        <Link href="/products" className="text-green-600 font-medium hover:text-green-700">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <Card key={product.id} className="h-full overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative h-40 w-full bg-gray-100">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/product/${product.id}`} className="block">
                  <p className="text-xs text-gray-500 mb-1">{product.store}</p>
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    ${product.price.toFixed(2)} / {product.unit}
                  </p>
                </Link>
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
