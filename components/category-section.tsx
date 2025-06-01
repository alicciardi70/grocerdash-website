import Link from "next/link"
import Image from "next/image"

const categories = [
  { id: 1, name: "Fruits & Vegetables", image: "/placeholder.svg?height=80&width=80", color: "bg-green-100" },
  { id: 2, name: "Dairy & Eggs", image: "/placeholder.svg?height=80&width=80", color: "bg-yellow-100" },
  { id: 3, name: "Meat & Seafood", image: "/placeholder.svg?height=80&width=80", color: "bg-red-100" },
  { id: 4, name: "Bakery", image: "/placeholder.svg?height=80&width=80", color: "bg-amber-100" },
  { id: 5, name: "Frozen Foods", image: "/placeholder.svg?height=80&width=80", color: "bg-blue-100" },
  { id: 6, name: "Snacks", image: "/placeholder.svg?height=80&width=80", color: "bg-purple-100" },
]

export default function CategorySection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.id}`} className="group">
            <div className="flex flex-col items-center">
              <div
                className={`relative h-24 w-24 rounded-full overflow-hidden mb-3 ${category.color} p-4 group-hover:scale-105 transition-transform`}
              >
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="text-sm font-medium text-center text-gray-800">{category.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
