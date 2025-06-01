import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Groceries delivered in as little as <span className="text-green-600">1 hour</span>
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Shop your favorite stores and get fresh groceries delivered to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/stores"
                className="px-6 py-3 text-white bg-green-600 rounded-full font-medium text-center hover:bg-green-700"
              >
                Shop Now
              </Link>
              <Link
                href="/how-it-works"
                className="px-6 py-3 text-green-600 bg-white border border-green-600 rounded-full font-medium text-center hover:bg-green-50"
              >
                How It Works
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Grocery delivery"
                fill
                className="object-cover rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
