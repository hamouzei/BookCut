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
  description?: string;
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
  userId?: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  workingHours: WorkingHours;
  isActive: boolean;
}

// Booking types
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Booking {
  id: number;
  userId?: string;
  barberId: number;
  serviceId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  // Joined fields
  serviceName?: string;
  servicePrice?: number;
  barberName?: string;
}

// Blocked time types
export interface BlockedTime {
  id: number;
  barberId: number;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
  isAllDay?: boolean;
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

// OTP Token
export interface OtpToken {
  id: number;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
}
