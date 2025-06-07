"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPinIcon, UsersIcon, PlaneIcon } from "lucide-react"
import { Header } from "@/components/header"

export default function HomePage() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
    tripType: "round-trip",
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchData.origin && searchData.destination && searchData.departureDate) {
      const params = new URLSearchParams(searchData)
      router.push(`/search?${params.toString()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Find Your Perfect Flight</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compare prices from hundreds of airlines and travel sites to get the best deals on flights
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-4xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <PlaneIcon className="h-6 w-6 text-blue-600" />
              Search Flights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Trip Type */}
              <div className="flex gap-4">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    value="round-trip"
                    checked={searchData.tripType === "round-trip"}
                    onChange={(e) => setSearchData({ ...searchData, tripType: e.target.value })}
                    className="text-blue-600"
                  />
                  Round Trip
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    value="one-way"
                    checked={searchData.tripType === "one-way"}
                    onChange={(e) => setSearchData({ ...searchData, tripType: e.target.value })}
                    className="text-blue-600"
                  />
                  One Way
                </Label>
              </div>

              {/* Origin and Destination */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin" className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    From
                  </Label>
                  <Input
                    id="origin"
                    placeholder="Origin city or airport"
                    value={searchData.origin}
                    onChange={(e) => setSearchData({ ...searchData, origin: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    To
                  </Label>
                  <Input
                    id="destination"
                    placeholder="Destination city or airport"
                    value={searchData.destination}
                    onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departure" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Departure
                  </Label>
                  <Input
                    id="departure"
                    type="date"
                    value={searchData.departureDate}
                    onChange={(e) => setSearchData({ ...searchData, departureDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                {searchData.tripType === "round-trip" && (
                  <div className="space-y-2">
                    <Label htmlFor="return" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Return
                    </Label>
                    <Input
                      id="return"
                      type="date"
                      value={searchData.returnDate}
                      onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                      min={searchData.departureDate || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                )}
              </div>

              {/* Passengers */}
              <div className="space-y-2">
                <Label htmlFor="passengers" className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4" />
                  Passengers
                </Label>
                <Select
                  value={searchData.passengers}
                  onValueChange={(value) => setSearchData({ ...searchData, passengers: value })}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                Search Flights
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlaneIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">Compare prices from hundreds of airlines to find the best deals</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Dates</h3>
            <p className="text-gray-600">Find the cheapest days to fly with our flexible date search</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
            <p className="text-gray-600">Simple and secure booking process with instant confirmation</p>
          </div>
        </div>
      </main>
    </div>
  )
}
