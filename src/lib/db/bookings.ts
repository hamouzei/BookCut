import { getSql } from './index';
import type { Booking, BookingStatus } from '@/types';

// Get bookings for a specific date and barber
export async function getBookingsByBarberAndDate(
  barberId: number,
  date: string
): Promise<Booking[]> {
  const sql = getSql();
  const result = await sql`
    SELECT 
      b.id, b.user_id, b.barber_id, b.service_id,
      b.customer_name, b.customer_email, b.customer_phone,
      b.date, b.start_time, b.end_time, b.status, b.notes, b.created_at
    FROM bookings b
    WHERE b.barber_id = ${barberId} 
      AND b.date = ${date}
      AND b.status NOT IN ('cancelled')
    ORDER BY b.start_time
  `;
  return result.map(row => ({
    id: row.id,
    userId: row.user_id,
    barberId: row.barber_id,
    serviceId: row.service_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status as BookingStatus,
    notes: row.notes,
    createdAt: row.created_at,
  })) as Booking[];
}

// Get bookings for a user
export async function getBookingsByUser(userId: string): Promise<Booking[]> {
  const sql = getSql();
  const result = await sql`
    SELECT 
      b.id, b.user_id, b.barber_id, b.service_id,
      b.customer_name, b.customer_email, b.customer_phone,
      b.date, b.start_time, b.end_time, b.status, b.notes, b.created_at,
      s.name as service_name, s.price as service_price,
      br.name as barber_name
    FROM bookings b
    LEFT JOIN services s ON b.service_id = s.id
    LEFT JOIN barbers br ON b.barber_id = br.id
    WHERE b.user_id = ${userId}
    ORDER BY b.date DESC, b.start_time DESC
  `;
  return result as Booking[];
}

// Get booking by ID
export async function getBookingById(id: number): Promise<Booking | null> {
  const sql = getSql();
  const result = await sql`
    SELECT 
      b.id, b.user_id, b.barber_id, b.service_id,
      b.customer_name, b.customer_email, b.customer_phone,
      b.date, b.start_time, b.end_time, b.status, b.notes, b.created_at,
      s.name as service_name, s.price as service_price, s.duration as service_duration,
      br.name as barber_name
    FROM bookings b
    LEFT JOIN services s ON b.service_id = s.id
    LEFT JOIN barbers br ON b.barber_id = br.id
    WHERE b.id = ${id}
  `;
  return (result[0] as Booking) || null;
}

// Create a new booking
export async function createBooking(data: {
  userId?: string;
  barberId: number;
  serviceId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}): Promise<Booking> {
  const sql = getSql();
  const result = await sql`
    INSERT INTO bookings (
      user_id, barber_id, service_id, 
      customer_name, customer_email, customer_phone,
      date, start_time, end_time, notes, status
    )
    VALUES (
      ${data.userId || null}, ${data.barberId}, ${data.serviceId},
      ${data.customerName}, ${data.customerEmail}, ${data.customerPhone || null},
      ${data.date}, ${data.startTime}, ${data.endTime}, ${data.notes || null}, 'confirmed'
    )
    RETURNING id, user_id, barber_id, service_id, customer_name, customer_email, 
              customer_phone, date, start_time, end_time, status, notes, created_at
  `;
  const row = result[0];
  return {
    id: row.id,
    userId: row.user_id,
    barberId: row.barber_id,
    serviceId: row.service_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status as BookingStatus,
    notes: row.notes,
    createdAt: row.created_at,
  } as Booking;
}

// Update booking status
export async function updateBookingStatus(
  id: number,
  status: BookingStatus
): Promise<boolean> {
  const sql = getSql();
  const result = await sql`
    UPDATE bookings
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id
  `;
  return result.length > 0;
}

// Cancel a booking
export async function cancelBooking(id: number): Promise<boolean> {
  return updateBookingStatus(id, 'cancelled');
}

// Check if a time slot is available
export async function isSlotAvailable(
  barberId: number,
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const sql = getSql();
  // Check for overlapping bookings
  const bookings = await sql`
    SELECT id FROM bookings
    WHERE barber_id = ${barberId}
      AND date = ${date}
      AND status NOT IN ('cancelled')
      AND (
        (start_time <= ${startTime} AND end_time > ${startTime})
        OR (start_time < ${endTime} AND end_time >= ${endTime})
        OR (start_time >= ${startTime} AND end_time <= ${endTime})
      )
  `;

  if (bookings.length > 0) return false;

  // Check for blocked times
  const blocked = await sql`
    SELECT id FROM blocked_times
    WHERE barber_id = ${barberId}
      AND date = ${date}
      AND (
        is_all_day = true
        OR (start_time <= ${startTime} AND end_time > ${startTime})
        OR (start_time < ${endTime} AND end_time >= ${endTime})
        OR (start_time >= ${startTime} AND end_time <= ${endTime})
      )
  `;

  return blocked.length === 0;
}

// Get all bookings for admin (with pagination)
export async function getAllBookings(
  page: number = 1,
  limit: number = 20,
  status?: BookingStatus
): Promise<{ bookings: Booking[]; total: number }> {
  const sql = getSql();
  const offset = (page - 1) * limit;

  let bookings;
  let totalResult;

  if (status) {
    bookings = await sql`
      SELECT 
        b.id, b.user_id, b.barber_id, b.service_id,
        b.customer_name, b.customer_email, b.customer_phone,
        b.date, b.start_time, b.end_time, b.status, b.notes, b.created_at,
        s.name as service_name, br.name as barber_name
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN barbers br ON b.barber_id = br.id
      WHERE b.status = ${status}
      ORDER BY b.date DESC, b.start_time DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    totalResult = await sql`SELECT COUNT(*) as count FROM bookings WHERE status = ${status}`;
  } else {
    bookings = await sql`
      SELECT 
        b.id, b.user_id, b.barber_id, b.service_id,
        b.customer_name, b.customer_email, b.customer_phone,
        b.date, b.start_time, b.end_time, b.status, b.notes, b.created_at,
        s.name as service_name, br.name as barber_name
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN barbers br ON b.barber_id = br.id
      ORDER BY b.date DESC, b.start_time DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    totalResult = await sql`SELECT COUNT(*) as count FROM bookings`;
  }

  return {
    bookings: bookings as Booking[],
    total: Number(totalResult[0].count),
  };
}
