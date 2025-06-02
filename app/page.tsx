import Link from "next/link"
import { Search, BarChart, MapPin, Scan, ShoppingBasket } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import RecentBaskets from "@/components/recent-baskets"
import NearbyStores from "@/components/nearby-stores"
import FeaturedProducts from "@/components/featured-products"
import BasketIcon from "@/components/basket-icon"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Grocery Scout</span>
            </Link>

            <div className="flex items-center gap-4">
              <BasketIcon />

              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Shop smarter, save <span className="text-blue-600">more</span>
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  Compare grocery prices across stores and make healthier choices with nutrition insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/search"
                    className="px-6 py-3 text-white bg-blue-600 rounded-full font-medium text-center hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Search className="h-5 w-5" />
                    Search Products
                  </Link>
                  <Link
                    href="/scan"
                    className="px-6 py-3 text-blue-600 bg-white border border-blue-600 rounded-full font-medium text-center hover:bg-blue-50 flex items-center justify-center gap-2"
                  >
                    <Scan className="h-5 w-5" />
                    Scan Barcode
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative h-64 md:h-96 w-full">
                  <Image
                    src="/variety-organic-vegetables-supermarket.jpg"
                    alt="Grocery comparison"
                    fill
                    className="object-cover rounded-lg shadow-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <ShoppingBasket className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-4">Compare Prices</h3>
                <p className="text-gray-600">
                  See the price of your entire grocery basket across multiple stores to find the best deals.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Track Nutrition</h3>
                <p className="text-gray-600">
                  View detailed nutritional information for products and your entire basket.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Find Nearby Stores</h3>
                <p className="text-gray-600">
                  Discover grocery stores in your area and compare prices at stores you frequent.
                </p>
              </CardContent>
            </Card>
          </div>

          <RecentBaskets />
          <NearbyStores />
          <FeaturedProducts />
        </div>
      </main>

      <footer className="bg-white border-t mt-10 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Grocery Scout</h3>
              <p className="text-gray-600">Compare grocery prices and nutrition information to shop smarter.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/search" className="text-gray-600 hover:text-blue-600">
                    Price Comparison
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="text-gray-600 hover:text-blue-600">
                    Nutrition Information
                  </Link>
                </li>
                <li>
                  <Link href="/scan" className="text-gray-600 hover:text-blue-600">
                    Barcode Scanning
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-gray-600 hover:text-blue-600">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-600 hover:text-blue-600">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                    My Profile
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Help</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-600">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Grocery Scout. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
