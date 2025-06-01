"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { getFeaturedProducts } from "@/lib/api"
import BasketButton from "@/components/basket-button"

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts()
        setProducts(products)
      } catch (error) {
        console.error("Error fetching featured products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded mb-1"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Products</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Featured products will appear here soon.</p>
          <Link href="/search">
            <BasketButton product={{}} className="mt-4">
              Search Products
            </BasketButton>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Popular Products</h2>
        <Link href="/search" className="text-blue-600 font-medium hover:text-blue-700">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  <div className="space-y-1 mb-3">
                    {product.prices.slice(0, 3).map((price, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex items-center">
                          {index === 0 && <span className="text-green-600 mr-1">●</span>}
                          <span className={index === 0 ? "text-green-600" : "text-gray-600"}>{price.store}</span>
                        </div>
                        <span className={index === 0 ? "font-medium text-green-600" : "font-medium"}>
                          ${price.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    {product.nutrition.calories} cal | {product.nutrition.protein} protein
                  </div>
                </Link>
                <BasketButton product={product} className="w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
