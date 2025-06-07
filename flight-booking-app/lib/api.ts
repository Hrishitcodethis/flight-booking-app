import axios from 'axios';
import { useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getFlights = async (params: { origin: string; destination: string; departureDate: string }) => {
  const res = await api.get('/flights', {
    params: {
      departure_city: params.origin,
      arrival_city: params.destination,
      departure_time: params.departureDate,
    },
  });
  return res.data;
};

export const getFlightById = async (id: number) => {
  const res = await api.get(`/flights/${id}`);
  return res.data;
};

export const createBooking = async (bookingData: {
  userId: string;
  flightId: string;
  bookingDate: string;
  totalPrice: number;
  passengers: Array<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    passportNumber: string;
    seatPreference: string;
  }>;
  contactInfo: {
    email: string;
    phone: string;
    emergencyContact: string;
  };
}) => {
  const res = await api.post('/bookings', bookingData);
  return res.data;
};

export const getBookingById = async (id: string) => {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
};

export const signIn = async (credentials: { email: string; password: string }) => {
  const res = await api.post('/auth/signin', credentials);
  return res.data;
};

export const getUserProfile = async (userId: string) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};

export const updateUserProfile = async (userId: string, userData: any) => {
  const res = await api.put(`/users/${userId}`, userData);
  // Map backend snake_case names to frontend camelCase names
  const updatedUser = res.data;
  return {
    ...updatedUser,
    firstName: updatedUser.first_name,
    lastName: updatedUser.last_name,
    // Ensure other fields also use camelCase if needed in the frontend User type
  };
};

export default api; 