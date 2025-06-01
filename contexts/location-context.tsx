"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface LocationContextType {
  zipCode: string
  setZipCode: (zipCode: string) => void
  selectedStores: Store[]
  setSelectedStores: (stores: Store[]) => void
  availableStores: Store[]
  isLocationSet: boolean
}

export interface Store {
  id: number
  name: string
  address: string
  distance: string
  image?: string
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [zipCode, setZipCodeState] = useState("")
  const [selectedStores, setSelectedStores] = useState<Store[]>([])
  const [availableStores, setAvailableStores] = useState<Store[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const savedZipCode = localStorage.getItem("grocersmart-zipcode")
    const savedStores = localStorage.getItem("grocersmart-selected-stores")

    if (savedZipCode) {
      setZipCodeState(savedZipCode)
      // Load available stores for this zip code
      loadStoresForZipCode(savedZipCode)
    }

    if (savedStores) {
      try {
        setSelectedStores(JSON.parse(savedStores))
      } catch (error) {
        console.error("Error loading selected stores:", error)
      }
    }
  }, [])

  // Save to localStorage when values change
  useEffect(() => {
    if (zipCode) {
      localStorage.setItem("grocersmart-zipcode", zipCode)
    }
  }, [zipCode])

  useEffect(() => {
    localStorage.setItem("grocersmart-selected-stores", JSON.stringify(selectedStores))
  }, [selectedStores])

  const setZipCode = (newZipCode: string) => {
    setZipCodeState(newZipCode)
    if (newZipCode) {
      loadStoresForZipCode(newZipCode)
    }
  }

  const loadStoresForZipCode = (zip: string) => {
    // Mock data - in real app this would be an API call
    const mockStores: Store[] = [
      {
        id: 1,
        name: "Fresh Market",
        address: "123 Main St",
        distance: "0.8 miles",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        name: "Organic Grocers",
        address: "456 Oak Ave",
        distance: "1.2 miles",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 3,
        name: "Value Supermarket",
        address: "789 Pine Rd",
        distance: "1.5 miles",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 4,
        name: "Farmers Direct",
        address: "101 Cedar Ln",
        distance: "2.3 miles",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 5,
        name: "Super Saver",
        address: "202 Maple Dr",
        distance: "3.1 miles",
        image: "/placeholder.svg?height=100&width=100",
      },
    ]

    setAvailableStores(mockStores)

    // Auto-select first 3 stores if none selected
    if (selectedStores.length === 0) {
      setSelectedStores(mockStores.slice(0, 3))
    }
  }

  const isLocationSet = zipCode.length >= 5

  return (
    <LocationContext.Provider
      value={{
        zipCode,
        setZipCode,
        selectedStores,
        setSelectedStores,
        availableStores,
        isLocationSet,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}
