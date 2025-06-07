'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function BookingSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Booking Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your flight has been booked successfully. You will receive a confirmation email shortly.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
} 