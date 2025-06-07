"use client"

import { Button } from "@/components/ui/button"
import { PlaneIcon, MenuIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/contexts/AuthContext"

export function Header() {
  const { user, isLoading } = useAuth()

  console.log('Header - Before conditional render:');
  console.log('  user:', user);
  console.log('  isLoading:', isLoading);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <PlaneIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">FlightBook</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Flights
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Hotels
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Cars
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Support
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {!isLoading && (
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
                      <Link href="/auth/sign-in">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href="/auth/sign-up">Sign Up</Link>
                    </Button>
                  </>
                )}
              </>
            )}
            <Button variant="ghost" size="sm" className="md:hidden">
              <MenuIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
