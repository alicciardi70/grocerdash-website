import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// This would normally come from an API
const store = {
  id: 1,
  name: "Fresh Market",
  image: "/placeholder.svg?height=100&width=100",
  banner: "/placeholder.svg?height=300&width=1200",
  deliveryTime: "30-45 min",
  rating: 4.8,
  reviewCount: 1243,
  description: "Your neighborhood grocery store with fresh produce, organic options, and everyday essentials.",
}

const categories = [
  "All",
  "Produce",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bakery",
  "Frozen",
  "Pantry",
  "Snacks",
  "Beverages",
]

const products = [
  {
    id: 1,
    name: "Organic Bananas",
    image: "/placeholder.svg?height=200&width=200",
    price: 2.99,
    unit: "bunch",
    category: "Produce",
  },
  {
    id: 2,
    name: "Avocado",
    image: "/placeholder.svg?height=200&width=200",
    price: 1.49,
    unit: "each",
    category: "Produce",
  },
  {
    id: 3,
    name: "Whole Milk",
    image: "/placeholder.svg?height=200&width=200",
    price: 3.99,
    unit: "gallon",
    category: "Dairy & Eggs",
  },
  {
    id: 4,
    name: "Cage-Free Eggs",
    image: "/placeholder.svg?height=200&width=200",
    price: 4.49,
    unit: "dozen",
    category: "Dairy & Eggs",
  },
  {
    id: 5,
    name: "Sourdough Bread",
    image: "/placeholder.svg?height=200&width=200",
    price: 5.99,
    unit: "loaf",
    category: "Bakery",
  },
  {
    id: 6,
    name: "Strawberries",
    image: "/placeholder.svg?height=200&width=200",
    price: 3.99,
    unit: "16 oz",
    category: "Produce",
  },
  {
    id: 7,
    name: "Chicken Breast",
    image: "/placeholder.svg?height=200&width=200",
    price: 6.99,
    unit: "lb",
    category: "Meat & Seafood",
  },
  {
    id: 8,
    name: "Spinach",
    image: "/placeholder.svg?height=200&width=200",
    price: 2.49,
    unit: "bunch",
    category: "Produce",
  },
]

export default function StorePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">{store.name}</h1>
          </div>
        </div>
      </header>

      <div className="relative h-40 md:h-60 w-full">
        <Image src={store.banner || "/placeholder.svg"} alt={store.name} fill className="object-cover" priority />
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border bg-white mr-4">
              <Image src={store.image || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{store.name}</h2>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">★ {store.rating}</span>
                <span className="mr-2">({store.reviewCount} reviews)</span>
                <span>{store.deliveryTime} delivery</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="text-gray-700">
              Store Info
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Start Shopping</Button>
          </div>
        </div>

        <p className="text-gray-700 mb-6">{store.description}</p>

        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search this store..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <Button variant="outline" className="ml-4 gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="All" className="mb-8">
          <TabsList className="w-full overflow-x-auto flex-nowrap justify-start h-auto p-0 bg-transparent">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="px-4 py-2 rounded-full data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {(category === "All" ? products : products.filter((p) => p.category === category)).map((product) => (
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
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                          <p className="text-sm text-gray-700 mb-3">
                            ${product.price.toFixed(2)} / {product.unit}
                          </p>
                        </Link>
                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
