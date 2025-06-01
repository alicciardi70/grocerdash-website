import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, ArrowRight } from "lucide-react"

const stores = [
  {
    id: 1,
    name: "Fresh Market",
    image: "/placeholder.svg?height=100&width=100",
    distance: "0.8 miles",
    address: "123 Main St, Anytown, NY",
  },
  {
    id: 2,
    name: "Organic Grocers",
    image: "/placeholder.svg?height=100&width=100",
    distance: "1.2 miles",
    address: "456 Oak Ave, Anytown, NY",
  },
  {
    id: 3,
    name: "Value Supermarket",
    image: "/placeholder.svg?height=100&width=100",
    distance: "1.5 miles",
    address: "789 Pine Rd, Anytown, NY",
  },
  {
    id: 4,
    name: "Farmers Direct",
    image: "/placeholder.svg?height=100&width=100",
    distance: "2.3 miles",
    address: "101 Cedar Ln, Anytown, NY",
  },
]

export default function NearbyStores() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Nearby Stores</h2>
        <Link href="/stores" className="text-blue-600 font-medium hover:text-blue-700 flex items-center">
          View All <ArrowRight className="ml-1 h-4 w-4" />
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
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {store.distance}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{store.address}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
