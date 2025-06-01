"use client"

import type React from "react"

import { Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBasket } from "@/contexts/basket-context"
import { useState } from "react"

interface BasketButtonProps {
  product: any
  store?: string
  size?: "sm" | "default" | "lg"
  className?: string
}

export default function BasketButton({ product, store, size = "sm", className = "" }: BasketButtonProps) {
  const { addItem } = useBasket()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToBasket = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if button is inside a link
    e.stopPropagation()

    setIsAdding(true)
    addItem(product, store)

    // Show success state briefly
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  return (
    <Button
      size={size}
      onClick={handleAddToBasket}
      disabled={isAdding}
      className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all ${className}`}
    >
      {isAdding ? (
        <>
          <Check className="h-4 w-4 mr-1" />
          Added!
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-1" />
          Add to Basket
        </>
      )}
    </Button>
  )
}
