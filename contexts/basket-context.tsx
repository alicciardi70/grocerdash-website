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
  prices: { // Array of prices for the same item across different stores
    store: string
    price: number
  }[]
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
    if (product.prices && product.prices.length > 0) {
      product.prices.forEach((storePrice: { store: string; price: number }) => {
        const newItem: BasketItem = {
          id: `${product.id}-${storePrice.store}`,
          name: product.name,
          image: product.image,
          price: storePrice.price,
          unit: product.unit || "each",
          quantity: 1,
          store: storePrice.store,
          prices: product.prices?.map((p: { store: string; price: number }) => ({
            store: p.store,
            price: p.price
          })) || [],
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
      })
    } else {
      // If no prices are available, add the item with default values
      const newItem: BasketItem = {
        id: `${product.id}-default`,
        name: product.name,
        image: product.image,
        price: 0,
        unit: product.unit || "each",
        quantity: 1,
        store: "default",
        prices: [],
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
