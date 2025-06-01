"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface BasketItem {
  id: string
  name: string
  image: string
  price: number
  unit: string
  quantity: number
  store: string
  nutrition: {
    calories: number
    protein: string
    fat: string
    carbs: string
  }
  brand?: string
}

interface BasketContextType {
  items: BasketItem[]
  addItem: (product: any, store?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearBasket: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const BasketContext = createContext<BasketContextType | undefined>(undefined)

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([])

  // Load basket from localStorage on mount
  useEffect(() => {
    const savedBasket = localStorage.getItem("grocersmart-basket")
    if (savedBasket) {
      try {
        setItems(JSON.parse(savedBasket))
      } catch (error) {
        console.error("Error loading basket from localStorage:", error)
      }
    }
  }, [])

  // Save basket to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("grocersmart-basket", JSON.stringify(items))
  }, [items])

  const addItem = (product: any, selectedStore?: string) => {
    // Use the best price store if no store is specified
    const bestPriceStore = product.prices?.[0] || { store: "Fresh Market", price: 0 }
    const store = selectedStore || bestPriceStore.store
    const price = selectedStore
      ? product.prices?.find((p) => p.store === selectedStore)?.price || bestPriceStore.price
      : bestPriceStore.price

    const newItem: BasketItem = {
      id: `${product.id}-${store}`,
      name: product.name,
      image: product.image,
      price: price,
      unit: product.unit || "each",
      quantity: 1,
      store: store,
      nutrition: product.nutrition,
      brand: product.brand,
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id)

      if (existingItem) {
        // If item already exists, increase quantity
        return currentItems.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Add new item
        return [...currentItems, newItem]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }

    setItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearBasket = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <BasketContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearBasket,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </BasketContext.Provider>
  )
}

export function useBasket() {
  const context = useContext(BasketContext)
  if (context === undefined) {
    throw new Error("useBasket must be used within a BasketProvider")
  }
  return context
}
