"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlaneIcon, ClockIcon, ArrowRightIcon } from "lucide-react"
import { Header } from "@/components/header"
import apiClient from "@/lib/apiClient"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    time: string
    airport: string
    city: string
  }
  arrival: {
    time: string
    airport: string
    city: string
  }
  duration: string
  price: number
  stops: number
  aircraft: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [flights, setFlights] = useState<Flight[]>([])
  const [sortBy, setSortBy] = useState("price")
  const [loading, setLoading] = useState(true)

  const searchData = {
    origin: searchParams.get("origin") || "",
    destination: searchParams.get("destination") || "",
    departureDate: searchParams.get("departureDate") || "",
    passengers: searchParams.get("passengers") || "1",
  }

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getFlights(searchData);
        setFlights(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
        // Optionally display an error message to the user
        setFlights([]); // Clear flights on error
      } finally {
        setLoading(false);
      }
    };

    if (searchData.origin && searchData.destination && searchData.departureDate) {
      fetchFlights();
    } else {
      setLoading(false); // Stop loading if search params are incomplete
    }
  }, [searchData]); // Rerun effect when searchData changes

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price
      case "duration":
        return a.duration.localeCompare(b.duration)
      case "departure":
        return a.departure.time.localeCompare(b.departure.time)
      default:
        return 0
    }
  })

  const handleBookFlight = (flight: Flight) => {
    const bookingData = {
      ...searchData,
      flightId: flight.id,
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      price: flight.price.toString(),
      departure: JSON.stringify(flight.departure),
      arrival: JSON.stringify(flight.arrival),
      duration: flight.duration,
    }
    const params = new URLSearchParams(bookingData)
    router.push(`/booking?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <PlaneIcon className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold mb-2">Searching for flights...</h2>
            <p className="text-gray-600">Finding the best deals for your trip</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Search Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">
            {searchData.origin} → {searchData.destination}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Departure: {new Date(searchData.departureDate).toLocaleDateString()}</span>
            <span>Passengers: {searchData.passengers}</span>
            <span>{flights.length} flights found</span>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Available Flights</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="departure">Departure Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Flight Results */}
        <div className="space-y-4">
          {sortedFlights.map((flight) => (
            <Card key={flight.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6 items-center">
                  {/* Flight Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <PlaneIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{flight.airline}</div>
                        <div className="text-sm text-gray-600">
                          {flight.flightNumber} • {flight.aircraft}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold">{flight.departure.time}</div>
                        <div className="text-sm text-gray-600">{flight.departure.airport}</div>
                      </div>

                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <ClockIcon className="h-3 w-3" />
                            {flight.duration}
                          </div>
                          {flight.stops === 0 ? (
                            <Badge variant="secondary" className="text-xs">
                              Direct
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              {flight.stops} stop{flight.stops > 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>

                      <div className="text-center">
                        <div className="text-xl font-bold">{flight.arrival.time}</div>
                        <div className="text-sm text-gray-600">{flight.arrival.airport}</div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">${flight.price}</div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>

                  {/* Book Button */}
                  <div className="text-center">
                    <Button onClick={() => handleBookFlight(flight)} className="w-full bg-blue-600 hover:bg-blue-700">
                      Book Now
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
