"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// This would normally come from a state management solution or API
const initialCartItems = [
  {
    id: 1,
    name: "Organic Bananas",
    image: "/placeholder.svg?height=200&width=200",
    price: 2.99,
    unit: "bunch",
    quantity: 1,
    store: "Fresh Market",
  },
  {
    id: 3,
    name: "Whole Milk",
    image: "/placeholder.svg?height=200&width=200",
    price: 3.99,
    unit: "gallon",
    quantity: 1,
    store: "Fresh Market",
  },
  {
    id: 5,
    name: "Sourdough Bread",
    image: "/placeholder.svg?height=200&width=200",
    price: 5.99,
    unit: "loaf",
    quantity: 1,
    store: "Fresh Market",
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 3.99
  const serviceFee = 2.99
  const total = subtotal + deliveryFee + serviceFee

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">Your Cart</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart to get started</p>
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Items from {cartItems[0].store}</h2>
                    <span className="text-sm text-gray-600">Delivery: 30-45 min</span>
                  </div>

                  <div className="divide-y">
                    {cartItems.map((item) => (
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
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
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
                </CardContent>
              </Card>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Delivery Instructions</h2>
                <textarea
                  className="w-full border rounded-lg p-3 text-sm"
                  rows={3}
                  placeholder="Add any special instructions for delivery..."
                />
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-3 mb-6">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6">
                    Proceed to Checkout
                  </Button>
                </Link>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
