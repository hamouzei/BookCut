// Types for the Barbershop Booking System

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'barber' | 'admin';
  createdAt: Date;
}

// Service types
export interface Service {
  id: number;
  name: string;
  duration: number; // in minutes
  price: number;
  isActive: boolean;
}

// Barber types
export interface WorkingHours {
  [key: string]: { // day of week: 'monday', 'tuesday', etc.
    start: string; // '09:00'
    end: string;   // '18:00'
    isWorking: boolean;
  };
}

export interface Barber {
  id: number;
  userId: string;
  name: string;
  workingHours: WorkingHours;
  isActive: boolean;
}

// Booking types
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: number;
  userId: string;
  barberId: number;
  serviceId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  status: BookingStatus;
  createdAt: Date;
}

// Blocked time types
export interface BlockedTime {
  id: number;
  barberId: number;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

// Time slot for availability
export interface TimeSlot {
  time: string;      // HH:MM
  available: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
