"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Minus, Plus, Trash2, Save, ShoppingBasket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useBasket } from "@/contexts/basket-context"
import BasketStoreComparison from "@/components/basket-store-comparison"

// Mock data for selected stores
const selectedStores = [
  { id: 1, name: "Fresh Market" },
  { id: 2, name: "Organic Grocers" },
  { id: 3, name: "Value Supermarket" },
]

export default function BasketPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useBasket()
  const [basketName, setBasketName] = useState("My Basket")

  // Calculate total calories
  const totalCalories = items.reduce((sum, item) => sum + item.nutrition.calories * item.quantity, 0)

  // Group items by store for display
  const itemsByStore = items.reduce(
    (acc, item) => {
      if (!acc[item.store]) {
        acc[item.store] = []
      }
      acc[item.store].push(item)
      return acc
    },
    {} as Record<string, typeof items>,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">Your Basket</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-blue-50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingBasket className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your basket is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your basket to get started</p>
            <Link href="/search">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">Search Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <ShoppingBasket className="h-5 w-5 text-blue-600 mr-2" />
                      <Input
                        value={basketName}
                        onChange={(e) => setBasketName(e.target.value)}
                        className="border-0 p-0 text-lg font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Save className="h-4 w-4" />
                      Save Basket
                    </Button>
                  </div>

                  <div className="flex items-center mb-4">
                    <h2 className="text-lg font-semibold mr-3">Comparing prices at:</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedStores.map((store) => (
                        <Badge key={store.id} variant="outline" className="py-1 px-3">
                          {store.name}
                        </Badge>
                      ))}
                      <Link href="/stores">
                        <Badge variant="outline" className="py-1 px-3 bg-gray-100 hover:bg-gray-200 cursor-pointer">
                          + Change
                        </Badge>
                      </Link>
                    </div>
                  </div>

                  {Object.entries(itemsByStore).map(([store, storeItems]) => (
                    <div key={store} className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b">Items from {store}</h3>
                      <div className="divide-y">
                        {storeItems.map((item) => (
                          <div key={item.id} className="py-4 flex">
                            <div className="relative h-20 w-20 bg-gray-100 rounded-md mr-4">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-contain p-2"
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex justify-between">
                                <Link href={`/product/${item.id.split("-")[0]}`}>
                                  <h3 className="font-medium hover:text-blue-600">{item.name}</h3>
                                </Link>
                                <div className="flex items-center">
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mr-2">
                                    {item.nutrition.calories * item.quantity} cal
                                  </Badge>
                                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 mb-2">
                                ${item.price.toFixed(2)} / {item.unit}
                              </p>

                              <div className="flex items-center">
                                <div className="flex items-center border rounded-full">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="mx-2 text-sm font-medium">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="ml-4 text-sm text-gray-500 hover:text-red-500 flex items-center"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {items.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-bold mb-4">Nutritional Summary</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Calories</p>
                      <p className="text-xl font-bold text-blue-700">{totalCalories}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Items</p>
                      <p className="text-xl font-bold text-green-700">
                        {items.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                      <p className="text-xl font-bold text-yellow-700">${getTotalPrice().toFixed(2)}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">Stores</p>
                      <p className="text-xl font-bold text-purple-700">{Object.keys(itemsByStore).length}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <BasketStoreComparison basketItems={items} stores={selectedStores} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
