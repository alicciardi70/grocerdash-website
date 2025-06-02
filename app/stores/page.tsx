"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLocation } from "@/contexts/location-context"
import LocationSetup from "@/components/location-setup"

export default function StoresPage() {
  const { zipCode, selectedStores, setSelectedStores, availableStores, isLocationSet } = useLocation()
  const [showLocationSetup, setShowLocationSetup] = useState(!isLocationSet)

  const toggleStoreSelection = (storeId: number) => {
    const store = availableStores.find((s) => s.id === storeId)
    if (!store) return

    const isSelected = selectedStores.some((s) => s.id === storeId)

    if (isSelected) {
      setSelectedStores(selectedStores.filter((s) => s.id !== storeId))
    } else {
      if (selectedStores.length < 5) {
        setSelectedStores([...selectedStores, store])
      }
    }
  }

  if (showLocationSetup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl font-bold">Select Stores</h1>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">Select Stores</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Stores in {zipCode}</h2>
              <Button
                variant="outline"
                onClick={() => setShowLocationSetup(true)}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Change Location
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Select up to 5 stores to compare prices across your basket. We recommend selecting stores you frequently
              shop at.
            </p>
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Available Stores</h2>
            <p className="text-sm text-gray-600">{selectedStores.length} of 5 selected</p>
          </div>

          <div className="space-y-4">
            {availableStores.map((store) => {
              const isSelected = selectedStores.some((s) => s.id === store.id)
              const canSelect = selectedStores.length < 5 || isSelected

              return (
                <div
                  key={`${store.id}-${store.name}`}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-blue-600 bg-blue-50"
                      : canSelect
                        ? "border-gray-200 hover:border-blue-300"
                        : "border-gray-200 opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => canSelect && toggleStoreSelection(store.id)}
                >
                  <div className="flex items-center">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border mr-4">
                      <Image src={store.image || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{store.name}</h3>
                        {isSelected && <Check className="h-5 w-5 text-blue-600" />}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" /> {store.distance}
                      </p>
                      <p className="text-sm text-gray-600">{store.address}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <Link href="/search">
            <Button variant="outline">Back to Search</Button>
          </Link>
          <Link href="/basket">
            <Button className="bg-blue-600 hover:bg-blue-700">View Basket ({selectedStores.length} stores)</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
