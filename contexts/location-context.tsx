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

  const loadStoresForZipCode = async (zip: string) => {
    try {
      const response = await fetch(`https://api.groceryscout.net/supermarkets?zipcode=${zip}&radius=3`)
      if (!response.ok) {
        throw new Error("Failed to fetch stores")
      }
      const stores = await response.json()
      setAvailableStores(stores)
    } catch (error) {
      console.error("Error loading stores:", error)
      setAvailableStores([]) // Fallback to empty list
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
