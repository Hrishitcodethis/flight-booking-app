"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/AuthContext"
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, CameraIcon, StarIcon } from "lucide-react"
import Link from "next/link"
import { updateUserProfile } from "@/lib/api"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading, updateUser } = useAuth()

  // --- Early returns based on loading and user status ---
  if (isAuthLoading) {
    console.log('ProfilePage: Still loading AuthContext. isAuthLoading:', isAuthLoading, 'user:', user);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!user) { // At this point, user is guaranteed to be null if we enter this block
    console.log('ProfilePage: No user found after loading. isAuthLoading:', isAuthLoading, 'user:', user);
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
            <Link href="/auth/sign-in">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // --- Now that user is guaranteed to be non-null, define variables and states that depend on 'user' ---
  // Initialize formData after user is confirmed to be non-null
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '', // Format for input
    passportNumber: user.passportNumber || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Recalculate initials and displayName whenever user changes
  const initials = (
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user.email?.[0]?.toUpperCase() || 'U'
  );

  const displayName = (
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.email || 'User'
  );

  // This useEffect is still useful to update formData if the user object changes
  // due to `updateUser` call from AuthContext after a profile save.
  useEffect(() => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
      passportNumber: user.passportNumber || '',
    });
  }, [user]);


  const handleSave = async () => {
    // user is guaranteed to be non-null here due to early return above
    setIsSaving(true)
    try {
      const updatedUser = await updateUserProfile(user.id, formData)

      // Update the user context with the new data from the API response
      updateUser(updatedUser)

      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast.error(`Failed to save profile: ${error.message || 'An unexpected error occurred.'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={displayName} />
                      <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      variant="outline"
                    >
                      <CameraIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">
                    {displayName}
                  </h3>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <StarIcon className="h-3 w-3" />
                      Gold Member
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Travel Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Flights</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Miles Earned</span>
                    <span className="font-semibold">12,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Countries Visited</span>
                    <span className="font-semibold">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold">2023</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details and contact information</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input id="email" value={formData.email} disabled /> {/* Email is not editable */}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <Separator />

                  <div>
                    <CardTitle className="mb-4">Travel Information</CardTitle>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date" // Use type="date" for native date picker
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passportNumber">Passport Number</Label>
                        <Input
                          id="passportNumber"
                          value={formData.passportNumber}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings (placeholder) */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive email updates about your flights and promotions.</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-gray-500">Change your account password.</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
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
