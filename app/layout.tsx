import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BasketProvider } from "@/contexts/basket-context"
import { LocationProvider } from "@/contexts/location-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GrocerSmart - Compare Grocery Prices & Nutrition",
  description: "Compare grocery prices across stores and make healthier choices with nutrition insights.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LocationProvider>
          <BasketProvider>{children}</BasketProvider>
        </LocationProvider>
      </body>
    </html>
  )
}
