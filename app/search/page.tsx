"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ArrowLeft, Filter, Info, Star, MapPin, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { searchProducts } from "@/lib/api"
import BasketButton from "@/components/basket-button"
import LocationSetup from "@/components/location-setup"
import { useLocation } from "@/contexts/location-context"
import BasketIcon from "@/components/basket-icon"
import { cn } from "@/lib/utils"

// Add type annotations for product and prices
interface Price {
  store: string
  price: number
  unitCost?: string
}

interface Product {
  id: string
  name: string
  image: string
  prices: Price[]
  nutrition: {
    calories: number
    protein: string
    fat: string
    carbs: string
  }
  brand?: string
  matchScore?: number
}

export default function SearchPage() {
  const { zipCode, selectedStores, isLocationSet } = useLocation()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLocationSetup, setShowLocationSetup] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    if (!isLocationSet) {
      setShowLocationSetup(true)
      return
    }

    setLoading(true)
    setError("")
    try {
      const products = await searchProducts(query, zipCode)
      setResults(products)
      if (products.length === 0) {
        setError(`No products found for "${query}" in ${zipCode}. Try a different search term.`)
      }
    } catch (error) {
      console.error("Search error:", error)
      setError("Failed to search products. Please try again.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Auto-search with debouncing
  useEffect(() => {
    if (!query.trim() || !isLocationSet) {
      setResults([])
      setError("")
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      setError("")
      try {
        const products = await searchProducts(query, zipCode)
        setResults(products)
        if (products.length === 0) {
          setError(`No products found for "${query}" in ${zipCode}. Try a different search term.`)
        }
      } catch (error) {
        console.error("Auto-search error:", error)
        setError("Failed to search products. Please try again.")
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [query, zipCode, isLocationSet])

  const getMatchScoreColor = (score: number) => {
    if (score >= 3) return "bg-green-100 text-green-800"
    if (score >= 2) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  // Show location setup if not set
  if (!isLocationSet && !showLocationSetup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className={cn("mr-4")}>
                  <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-xl font-bold">Search Products</h1>
              </div>
              <BasketIcon />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <LocationSetup onComplete={() => setShowLocationSetup(false)} />
          </div>
        </main>
      </div>
    )
  }

  if (showLocationSetup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className={cn("mr-4")}>
                  <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-xl font-bold">Search Products</h1>
              </div>
              <BasketIcon />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <LocationSetup onComplete={() => setShowLocationSetup(false)} showTitle={false} />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className={cn("mr-4")}>
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl font-bold">Search Products</h1>
            </div>
            <BasketIcon />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={`Search for products in ${zipCode}...`}
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
            <Button variant="outline" className={cn("gap-2")}>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </form>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Comparing prices at:</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocationSetup(true)}
                className="text-gray-600 hover:text-blue-600"
              >
                <MapPin className="h-4 w-4 mr-1" />
                {zipCode}
              </Button>
              <Link href="/stores">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  <Settings className="h-4 w-4 mr-1" />
                  Change Stores
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedStores.map((store) => (
              <Badge key={store.id} variant="outline" className={cn("py-1 px-3")}>
                {store.name} • {store.distance}
              </Badge>
            ))}
            {selectedStores.length === 0 && (
              <Link href="/stores">
                <Badge
                  variant="outline"
                  className="py-1 px-3 bg-blue-50 hover:bg-blue-100 cursor-pointer text-blue-600"
                >
                  + Select Stores
                </Badge>
              </Link>
            )}
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-gray-500">{error}</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && !query && (
          <div className="text-center py-12">
            <p className="text-gray-500">Start typing to search for products in {zipCode}...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex p-4">
                  <div className="relative h-24 w-24 bg-gray-100 rounded-md mr-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className={cn("object-contain p-2")}
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight">{product.name}</h3>
                        {product.matchScore && (
                          <Badge className={`text-xs ml-2 ${getMatchScoreColor(product.matchScore)}`}>
                            <Star className="h-3 w-3 mr-1" />
                            {product.matchScore}
                          </Badge>
                        )}
                      </div>
                      {product.brand && <p className="text-xs text-gray-500 mb-1">{product.brand}</p>}
                      <div className="flex items-center mb-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">
                          {product.nutrition.calories} cal
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                                <Info className="h-4 w-4 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs">
                                <p>Protein: {product.nutrition.protein}</p>
                                <p>Fat: {product.nutrition.fat}</p>
                                <p>Carbs: {product.nutrition.carbs}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="border-t">
                  <div className="p-4">
                    <div className="space-y-2 mb-3">
                      {product.prices
                        .sort((a, b) => a.price - b.price)
                        .slice(0, 4)
                        .map((price, index) => (
                          <div
                            key={index}
                            className={`flex justify-between text-xs ${index === 0 ? "font-medium text-lg" : ""}`}
                          >
                            <div className="flex items-center">
                              {index === 0 && <span className="text-green-600 mr-1"></span>}
                              <span className={index === 0 ? "text-green-600 text-lg" : "text-gray-600"}>{price.store}</span>
                            </div>
                            <div className="text-right">
                              <span className={index === 0 ? "font-medium text-green-600 text-lg" : ""}>
                                ${price.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      {product.prices.length === 0 && (
                        <div className="text-sm text-gray-500 italic">No prices available</div>
                      )}
                    </div>
                    <BasketButton product={product} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
