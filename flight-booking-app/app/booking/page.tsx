"use client"

import type React from "react"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { PlaneIcon, UserIcon, CreditCardIcon, ShieldCheckIcon } from "lucide-react"
import { Header } from "@/components/header"
import apiClient from "@/lib/apiClient"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

interface PassengerInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  passportNumber: string
  seatPreference: string
}

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const flightData = {
    origin: searchParams.get("origin") || "",
    destination: searchParams.get("destination") || "",
    departureDate: searchParams.get("departureDate") || "",
    passengers: Number.parseInt(searchParams.get("passengers") || "1"),
    airline: searchParams.get("airline") || "",
    flightNumber: searchParams.get("flightNumber") || "",
    price: Number.parseInt(searchParams.get("price") || "0"),
    departure: JSON.parse(searchParams.get("departure") || "{}"),
    arrival: JSON.parse(searchParams.get("arrival") || "{}"),
    duration: searchParams.get("duration") || "",
  }

  const [passengers, setPassengers] = useState<PassengerInfo[]>(
    Array.from({ length: flightData.passengers }, () => ({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      passportNumber: "",
      seatPreference: "economy",
    })),
  )

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    emergencyContact: "",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const [isBooking, setIsBooking] = useState(false)
  const { user } = useAuth()

  const updatePassenger = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengers]
    updated[index] = { ...updated[index], [field]: value }
    setPassengers(updated)
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("You must be logged in to book a flight.")
      return
    }

    setIsBooking(true)
    try {
      const bookingPayload = {
        userId: user.id,
        flightId: flightData.id,
        bookingDate: new Date().toISOString(),
        totalPrice: flightData.price * flightData.passengers,
        passengers: passengers,
        contactInfo: contactInfo,
      }

      console.log('Booking Payload:', bookingPayload)

      const response = await apiClient.createBooking(bookingPayload)

      console.log('Booking API Response:', response)

      if (response.data?.bookingReference) {
        router.push(`/confirmation?bookingReference=${response.data.bookingReference}`)
      } else {
        toast.error("Booking failed. Please try again.")
        console.error('Booking creation failed with unexpected response:', response)
      }

    } catch (error: any) {
      console.error('Error creating booking:', error)
      toast.error(`Booking failed: ${error.message || 'An unexpected error occurred.'}`)
    } finally {
      setIsBooking(false)
    }
  }

  const totalPrice = flightData.price * flightData.passengers
  const taxes = Math.round(totalPrice * 0.15)
  const finalPrice = totalPrice + taxes

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Flight Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlaneIcon className="h-5 w-5" />
                    Flight Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{flightData.airline}</div>
                        <div className="text-sm text-gray-600">{flightData.flightNumber}</div>
                      </div>
                      <Badge>Direct Flight</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold">{flightData.departure.time}</div>
                        <div className="text-sm text-gray-600">{flightData.departure.airport}</div>
                        <div className="text-sm text-gray-600">{flightData.origin}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-gray-600">{flightData.duration}</div>
                        <div className="w-16 h-px bg-gray-300 my-2"></div>
                        <div className="text-xs text-gray-500">
                          {new Date(flightData.departureDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold">{flightData.arrival.time}</div>
                        <div className="text-sm text-gray-600">{flightData.arrival.airport}</div>
                        <div className="text-sm text-gray-600">{flightData.destination}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <form onSubmit={handleBooking} className="space-y-6">
                {/* Passenger Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      Passenger Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {passengers.map((passenger, index) => (
                      <div key={index} className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-semibold">Passenger {index + 1}</h4>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`firstName-${index}`}>First Name</Label>
                            <Input
                              id={`firstName-${index}`}
                              value={passenger.firstName}
                              onChange={(e) => updatePassenger(index, "firstName", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                            <Input
                              id={`lastName-${index}`}
                              value={passenger.lastName}
                              onChange={(e) => updatePassenger(index, "lastName", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`dob-${index}`}>Date of Birth</Label>
                            <Input
                              id={`dob-${index}`}
                              type="date"
                              value={passenger.dateOfBirth}
                              onChange={(e) => updatePassenger(index, "dateOfBirth", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`passport-${index}`}>Passport Number</Label>
                            <Input
                              id={`passport-${index}`}
                              value={passenger.passportNumber}
                              onChange={(e) => updatePassenger(index, "passportNumber", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`seat-${index}`}>Seat Preference</Label>
                          <Select
                            value={passenger.seatPreference}
                            onValueChange={(value) => updatePassenger(index, "seatPreference", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="economy">Economy</SelectItem>
                              <SelectItem value="premium-economy">Premium Economy (+$50)</SelectItem>
                              <SelectItem value="business">Business Class (+$200)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency">Emergency Contact</Label>
                      <Input
                        id="emergency"
                        value={contactInfo.emergencyContact}
                        onChange={(e) => setContactInfo({ ...contactInfo, emergencyContact: e.target.value })}
                        placeholder="Name and phone number"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCardIcon className="h-5 w-5" />
                      Payment Information (Mock)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        value={paymentInfo.cardholderName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Action Button */}
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-lg py-6" disabled={isBooking}>
                  {isBooking ? 'Processing Booking...' : 'Confirm Booking'}
                  <ShieldCheckIcon className="h-5 w-5 ml-2" />
                </Button>
              </form>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Price Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>
                      Flight ({flightData.passengers} passenger{flightData.passengers > 1 ? "s" : ""})
                    </span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span>${taxes}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${finalPrice}</span>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <ShieldCheckIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">Secure Payment</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">Your payment information is encrypted and secure</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
