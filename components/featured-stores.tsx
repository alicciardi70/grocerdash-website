import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const stores = [
  {
    id: 1,
    name: "Fresh Market",
    image: "/placeholder.svg?height=100&width=100",
    deliveryTime: "30-45 min",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Organic Grocers",
    image: "/placeholder.svg?height=100&width=100",
    deliveryTime: "25-40 min",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Value Supermarket",
    image: "/placeholder.svg?height=100&width=100",
    deliveryTime: "35-50 min",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Farmers Direct",
    image: "/placeholder.svg?height=100&width=100",
    deliveryTime: "40-55 min",
    rating: 4.9,
  },
]

export default function FeaturedStores() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Stores</h2>
        <Link href="/stores" className="text-green-600 font-medium hover:text-green-700">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stores.map((store) => (
          <Link key={store.id} href={`/store/${store.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border">
                    <Image src={store.image || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{store.name}</h3>
                    <p className="text-sm text-gray-500">{store.deliveryTime}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Free delivery</span>
                  <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    ★ {store.rating}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
