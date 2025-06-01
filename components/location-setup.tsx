"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLocation } from "@/contexts/location-context"

interface LocationSetupProps {
  onComplete?: () => void
  showTitle?: boolean
}

export default function LocationSetup({ onComplete, showTitle = true }: LocationSetupProps) {
  const { zipCode, setZipCode } = useLocation()
  const [inputZip, setInputZip] = useState(zipCode)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputZip.length < 5) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setZipCode(inputZip)
      setIsLoading(false)
      onComplete?.()
    }, 1000)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="bg-blue-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
          {showTitle && (
            <>
              <h2 className="text-xl font-bold mb-2">Set Your Location</h2>
              <p className="text-gray-600 text-sm">
                Enter your ZIP code to find nearby stores and compare prices in your area.
              </p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="zipcode"
                type="text"
                placeholder="Enter ZIP code"
                value={inputZip}
                onChange={(e) => setInputZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                className="pl-10"
                maxLength={5}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={inputZip.length < 5 || isLoading}
          >
            {isLoading ? (
              "Finding Stores..."
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Stores
              </>
            )}
          </Button>
        </form>

        {zipCode && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">✓ Location set to {zipCode}. You can change this anytime.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
