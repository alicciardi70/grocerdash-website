"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import NutritionLabel from "@/components/nutrition-label"
import PriceComparison from "@/components/price-comparison"
import BasketButton from "@/components/basket-button"
import { getProductById, getFeaturedProducts, TransformedProduct } from "@/lib/api"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<TransformedProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<TransformedProduct[]>([])
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(params.id)

        if (productData) {
          const expandedProduct: TransformedProduct = {
            ...productData,
            brand: productData.brand || "Nature's Best",
            description:
              productData.description || "Fresh and delicious product perfect for your daily nutrition needs.",
            nutrition: {
              servingSize: "1 medium serving",
              servingsPerContainer: "5-7",
              calories: productData.nutrition.calories,
              totalFat: productData.nutrition.totalFat,
              saturatedFat: "0.1g",
              transFat: "0g",
              cholesterol: "0mg",
              sodium: "1mg",
              totalCarbs: productData.nutrition.totalCarbs,
              dietaryFiber: "3.1g",
              sugars: "14.4g",
              protein: productData.nutrition.protein,
              vitaminD: "0mcg",
              calcium: "5mg",
              iron: "0.3mg",
              potassium: "422mg",
            },
            ingredients: productData.ingredients || "Natural ingredients.",
          }

          setProduct(expandedProduct)
        }

        const relatedProducts = await getFeaturedProducts()
        setRelatedProducts(
          relatedProducts.slice(0, 3).map((p) => ({
            id: p.id,
            name: p.name,
            image: p.image,
            price: p.prices[0]?.price || 0,
            unit: p.unit,
          })),
        )
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center">
              <Link href="/search" className="mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl font-bold">Product Details</h1>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-96 rounded-lg mb-6"></div>
            <div className="bg-gray-200 h-8 rounded mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link href="/search">
            <Button className="bg-blue-600 hover:bg-blue-700">Back to Search</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/search" className="mr-4">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">Product Details</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="relative h-64 md:h-96 w-full bg-gray-100">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  priority
                />
              </div>
            </div>

            <div className="p-6 md:w-2/3">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {product.nutrition.calories} calories per serving
                </Badge>
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Price Comparison</h3>
                <PriceComparison prices={product.prices} unit={product.unit} />
              </div>

              <div className="flex items-center mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-4 font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>

                <div className="ml-6">
                  <BasketButton product={{ ...product, quantity }} className="px-8 rounded-full" size="default" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="mb-1">
                      <span className="text-gray-600 font-medium">Ingredients:</span> {product.ingredients}
                    </p>
                    <p>
                      <span className="text-gray-600 font-medium">Allergens:</span> {product.allergens}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Nutrition Facts</h3>
                <NutritionLabel nutrition={product.nutrition} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Similar Products</h3>
                <div className="space-y-4">
                  {relatedProducts.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`} className="flex items-center">
                      <div className="relative h-16 w-16 bg-gray-100 rounded-md mr-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          ${product.price.toFixed(2)} / {product.unit}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
