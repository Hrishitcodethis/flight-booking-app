"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/AuthContext"
import { PlaneIcon, CalendarIcon, SearchIcon, DownloadIcon, XIcon } from "lucide-react"
import Link from "next/link"

interface Booking {
  id: string
  bookingReference: string
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  airline: string
  flightNumber: string
  status: "confirmed" | "cancelled" | "completed"
  price: number
  passengers: number
}

export default function BookingsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your bookings</h1>
            <Link href="/auth/sign-in">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const mockBookings: Booking[] = [
    {
      id: "1",
      bookingReference: "FB12345678",
      origin: "New York",
      destination: "Los Angeles",
      departureDate: "2024-01-15",
      airline: "American Airlines",
      flightNumber: "AA 1234",
      status: "confirmed",
      price: 299,
      passengers: 1,
    },
    {
      id: "2",
      bookingReference: "FB87654321",
      origin: "Chicago",
      destination: "Miami",
      departureDate: "2024-01-22",
      returnDate: "2024-01-29",
      airline: "Delta Airlines",
      flightNumber: "DL 5678",
      status: "confirmed",
      price: 459,
      passengers: 2,
    },
    {
      id: "3",
      bookingReference: "FB11223344",
      origin: "San Francisco",
      destination: "Seattle",
      departureDate: "2023-12-10",
      airline: "Alaska Airlines",
      flightNumber: "AS 9012",
      status: "completed",
      price: 189,
      passengers: 1,
    },
    {
      id: "4",
      bookingReference: "FB55667788",
      origin: "Boston",
      destination: "Denver",
      departureDate: "2024-02-05",
      airline: "United Airlines",
      flightNumber: "UA 3456",
      status: "cancelled",
      price: 329,
      passengers: 1,
    },
  ]

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.airline.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage and view all your flight bookings</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by booking reference, destination, or airline..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bookings</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <PlaneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "You haven't made any flight bookings yet"}
                  </p>
                  <Link href="/">
                    <Button>Book Your First Flight</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-6 items-center">
                      {/* Flight Info */}
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <PlaneIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold">{booking.airline}</div>
                            <div className="text-sm text-gray-600">{booking.flightNumber}</div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="font-medium">
                            {booking.origin} → {booking.destination}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {new Date(booking.departureDate).toLocaleDateString()}
                            </div>
                            {booking.returnDate && (
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                Return: {new Date(booking.returnDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Booking Reference: <span className="font-mono">{booking.bookingReference}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Passengers */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">${booking.price}</div>
                        <div className="text-sm text-gray-600">
                          {booking.passengers} passenger{booking.passengers > 1 ? "s" : ""}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {booking.status === "confirmed" && (
                          <>
                            <Button size="sm" variant="outline">
                              <DownloadIcon className="h-4 w-4 mr-2" />
                              Download Ticket
                            </Button>
                            <Button size="sm" variant="outline">
                              Manage Booking
                            </Button>
                          </>
                        )}
                        {booking.status === "cancelled" && (
                          <Button size="sm" variant="outline" disabled>
                            <XIcon className="h-4 w-4 mr-2" />
                            Cancelled
                          </Button>
                        )}
                        {booking.status === "completed" && (
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Common booking management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Change Flight
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <XIcon className="h-5 w-5" />
                  Cancel Booking
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <PlaneIcon className="h-5 w-5" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
