"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/AuthContext"
import { PlaneIcon, CalendarIcon, MapPinIcon, ClockIcon, TrendingUpIcon, StarIcon } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
            <Link href="/auth/sign-in">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const upcomingFlights = [
    {
      id: "1",
      destination: "Los Angeles",
      origin: "New York",
      date: "2024-01-15",
      time: "08:00",
      airline: "American Airlines",
      flightNumber: "AA 1234",
      status: "confirmed",
    },
    {
      id: "2",
      destination: "Miami",
      origin: "Chicago",
      date: "2024-01-22",
      time: "14:30",
      airline: "Delta Airlines",
      flightNumber: "DL 5678",
      status: "confirmed",
    },
  ]

  const recentSearches = [
    { origin: "New York", destination: "London", date: "2024-02-01" },
    { origin: "San Francisco", destination: "Tokyo", date: "2024-02-15" },
    { origin: "Boston", destination: "Paris", date: "2024-03-01" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h1>
            <p className="text-gray-600">Here's what's happening with your travel plans</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming Trips</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <PlaneIcon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Miles Earned</p>
                    <p className="text-2xl font-bold">12,450</p>
                  </div>
                  <TrendingUpIcon className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Loyalty Status</p>
                    <p className="text-2xl font-bold">Gold</p>
                  </div>
                  <StarIcon className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upcoming Flights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlaneIcon className="h-5 w-5" />
                  Upcoming Flights
                </CardTitle>
                <CardDescription>Your next travel plans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingFlights.map((flight) => (
                  <div key={flight.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">
                          {flight.origin} → {flight.destination}
                        </div>
                        <div className="text-sm text-gray-600">
                          {flight.airline} {flight.flightNumber}
                        </div>
                      </div>
                      <Badge variant="secondary">{flight.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(flight.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {flight.time}
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/bookings">
                  <Button variant="outline" className="w-full">
                    View All Bookings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Recent Searches
                </CardTitle>
                <CardDescription>Quick access to your recent flight searches</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSearches.map((search, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {search.origin} → {search.destination}
                        </div>
                        <div className="text-sm text-gray-600">{new Date(search.date).toLocaleDateString()}</div>
                      </div>
                      <Button size="sm" variant="outline">
                        Search Again
                      </Button>
                    </div>
                  </div>
                ))}
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    New Flight Search
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <PlaneIcon className="h-6 w-6" />
                    Book New Flight
                  </Button>
                </Link>
                <Link href="/bookings">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <CalendarIcon className="h-6 w-6" />
                    Manage Bookings
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <StarIcon className="h-6 w-6" />
                    Update Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
