"use client"

import Link from "next/link"
import { ShoppingBasket } from "lucide-react"
import { useBasket } from "@/contexts/basket-context"

export default function BasketIcon() {
  const { getTotalItems } = useBasket()
  const totalItems = getTotalItems()

  return (
    <Link
      href="/basket"
      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 relative"
    >
      <ShoppingBasket className="h-5 w-5" />
      <span>Basket</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
