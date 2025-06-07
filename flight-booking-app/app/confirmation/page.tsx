"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircleIcon, PlaneIcon, DownloadIcon, ShareIcon, CalendarIcon, MapPinIcon } from "lucide-react"
import { Header } from "@/components/header"
import Link from "next/link"
import { useState, useEffect } from "react"
import apiClient from "@/lib/apiClient"
import { toast } from "sonner"

interface BookingDetails {
  bookingReference: string
  flightId: string
  bookingDate: string
  totalPrice: number
  passengers: Array<{
    firstName: string
    lastName: string
    dateOfBirth: string
    passportNumber: string
    seatPreference: string
  }>
  contactInfo: {
    email: string
    phone: string
    emergencyContact: string
  }
  origin?: string
  destination?: string
  departureDate?: string
  airline?: string
  flightNumber?: string
  departure?: { time: string; airport: string; city: string }
  arrival?: { time: string; airport: string; city: string }
  duration?: string
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams()

  const bookingReference = searchParams.get("bookingReference")

  const [bookingData, setBookingData] = useState<BookingDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingReference) {
        setError("Booking reference not found in URL.")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.getBookingById(bookingReference)
        if (response.data) {
          setBookingData(response.data)
        } else {
          setError("Booking details not found.")
          toast.error("Booking details not found.")
        }
      } catch (err: any) {
        console.error('Error fetching booking details:', err)
        setError(`Failed to fetch booking details: ${err.message || 'An error occurred.'}`)
        toast.error(`Failed to fetch booking details: ${err.message || 'An error occurred.'}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookingDetails()
  }, [bookingReference])

  const handleDownloadTicket = () => {
    if (!bookingData) return
    alert("Ticket download functionality would be implemented here")
  }

  const handleShareBooking = () => {
    if (!bookingData) return
    if (navigator.share) {
      navigator.share({
        title: "Flight Booking Confirmation",
        text: `My flight booking ${bookingData.bookingReference} is confirmed!`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Booking link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <PlaneIcon className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold mb-2">Loading Booking Details...</h2>
          <p className="text-gray-600">Fetching your confirmation details</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center text-red-600">
          <h2 className="text-2xl font-semibold mb-2">Error Loading Booking</h2>
          <p className="text-gray-600">{error}</p>
          <Button asChild className="mt-4">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Booking Not Found</h2>
          <p className="text-gray-600">Could not retrieve booking details.</p>
          <Button asChild className="mt-4">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Your flight has been successfully booked. A confirmation email has been sent to your email address.
            </p>
          </div>

          {/* Booking Reference */}
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Booking Reference</h2>
              <div className="text-3xl font-bold text-green-600 tracking-wider">{bookingData.bookingReference}</div>
              <p className="text-sm text-gray-600 mt-2">Keep this reference number for your records</p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Flight Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlaneIcon className="h-5 w-5" />
                    Flight Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Airline and Flight Number */}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold">{bookingData.airline || 'N/A'}</div>
                      <div className="text-gray-600">{bookingData.flightNumber || 'N/A'}</div>
                    </div>
                    <Badge variant="secondary">Confirmed</Badge>
                  </div>

                  {/* Flight Route */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <div>
                          <div className="font-semibold">{bookingData.departure?.time || 'N/A'}</div>
                          <div className="text-sm text-gray-600">{bookingData.departure?.airport || 'N/A'}</div>
                          <div className="text-sm text-gray-600">{bookingData.origin || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">{bookingData.duration || 'N/A'}</div>
                        <div className="w-16 h-px bg-gray-300 my-2"></div>
                        <div className="text-xs text-gray-500">Direct</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold">{bookingData.arrival?.time || 'N/A'}</div>
                          <div className="text-sm text-gray-600">{bookingData.arrival?.airport || 'N/A'}</div>
                          <div className="text-sm text-gray-600">{bookingData.destination || 'N/A'}</div>
                        </div>
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {bookingData.departureDate ? new Date(bookingData.departureDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Important Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Check-in</h4>
                      <p className="text-gray-600">Online check-in opens 24 hours before departure</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Baggage</h4>
                      <p className="text-gray-600">1 carry-on bag and 1 checked bag included</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Arrival</h4>
                      <p className="text-gray-600">Arrive at airport 2 hours before domestic flights</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Documents</h4>
                      <p className="text-gray-600">Valid ID or passport required for travel</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Passengers</span>
                      <span>{bookingData.passengers.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Class</span>
                      <span>Economy</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trip Type</span>
                      <span>One Way</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total Paid</span>
                    <span>${bookingData.totalPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleDownloadTicket} className="w-full" variant="outline">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download Ticket
                  </Button>
                  <Button onClick={handleShareBooking} className="w-full" variant="outline">
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share Booking
                  </Button>
                  <Button className="w-full" variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Check-in online</div>
                      <div className="text-gray-600">24 hours before departure</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Arrive at airport</div>
                      <div className="text-gray-600">2 hours before departure</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Prepare documents</div>
                      <div className="text-gray-600">ID, passport, boarding pass</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Return Home */}
          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
