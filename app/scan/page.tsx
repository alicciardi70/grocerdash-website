"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Camera, X, Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { searchProducts } from "@/lib/api"
import BasketButton from "@/components/basket-button"

export default function ScanPage() {
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [product, setProduct] = useState<any | null>(null)

  const startScan = () => {
    setScanning(true)
    setTimeout(async () => {
      try {
        const queries = ["graham crackers", "apples", "milk", "bread", "oranges"]
        const randomQuery = queries[Math.floor(Math.random() * queries.length)]

        const products = await searchProducts(randomQuery)

        if (products && products.length > 0) {
          const scannedProduct = products[0]
          setProduct(scannedProduct)
          setScanned(true)
        }
      } catch (error) {
        console.error("Error fetching scanned product:", error)
      } finally {
        setScanning(false)
      }
    }, 2000)
  }

  const resetScan = () => {
    setScanning(false)
    setScanned(false)
    setProduct(null)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 3) return "bg-green-100 text-green-800"
    if (score >= 2) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">Scan Barcode</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            {!scanning && !scanned ? (
              <div className="text-center py-12">
                <div className="bg-blue-50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                  <Camera className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Scan Product Barcode</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Point your camera at a product barcode to quickly add it to your basket and compare prices.
                </p>
                <Button onClick={startScan} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  Start Scanning
                </Button>
              </div>
            ) : scanning ? (
              <div className="relative">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="animate-pulse mb-2">Scanning...</p>
                    <p className="text-sm text-gray-400">Position barcode in the center of the screen</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full bg-white"
                  onClick={resetScan}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : product ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h2 className="text-xl font-bold mr-3">Scan Result</h2>
                    {product.matchScore && (
                      <Badge className={`${getMatchScoreColor(product.matchScore)}`}>
                        <Star className="h-3 w-3 mr-1" />
                        Match: {product.matchScore}/4
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={resetScan}>
                    Scan Again
                  </Button>
                </div>

                {product.matchReason && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">{product.matchReason}</p>
                  </div>
                )}

                <div className="flex items-start mb-6">
                  <div className="relative h-24 w-24 bg-gray-100 rounded-md mr-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    {product.brand && <p className="text-sm text-gray-500 mb-1">{product.brand}</p>}
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <div className="flex items-center">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">
                        {product.nutrition.calories} cal
                      </span>
                      {product.upc && <span className="text-xs text-gray-500">UPC: {product.upc}</span>}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Price Comparison</h3>
                  <div className="space-y-2">
                    {product.prices.map((price, index) => (
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
                          <span className={index === 0 ? "font-medium text-green-600" : ""}>
                            ${price.price.toFixed(2)}
                          </span>
                          {price.unitCost && <div className="text-xs text-gray-500">{price.unitCost}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <BasketButton product={product} className="w-full rounded-full" />
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="text-center">
          <h3 className="font-semibold mb-4">Recently Scanned Products</h3>
          <p className="text-gray-500 text-sm">No recently scanned products</p>
        </div>
      </main>
    </div>
  )
}
