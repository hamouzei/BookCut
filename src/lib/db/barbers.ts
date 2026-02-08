import { getSql } from './index';
import type { Barber, WorkingHours } from '@/types';

// Get all active barbers
export async function getBarbers(): Promise<Barber[]> {
  const sql = getSql();
  const result = await sql`
    SELECT id, user_id, name, email, phone, bio, avatar_url, working_hours, is_active
    FROM barbers
    WHERE is_active = true
    ORDER BY name
  `;
  return result.map(row => ({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    workingHours: row.working_hours as WorkingHours,
    isActive: row.is_active,
  })) as Barber[];
}

// Get barber by ID
export async function getBarberById(id: number): Promise<Barber | null> {
  const sql = getSql();
  const result = await sql`
    SELECT id, user_id, name, email, phone, bio, avatar_url, working_hours, is_active
    FROM barbers
    WHERE id = ${id} AND is_active = true
  `;
  if (!result[0]) return null;
  const row = result[0];
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    workingHours: row.working_hours as WorkingHours,
    isActive: row.is_active,
  } as Barber;
}

// Get barber working hours for a specific day
export async function getBarberWorkingHours(
  barberId: number,
  dayOfWeek: string
): Promise<{ start: string; end: string; isWorking: boolean } | null> {
  const barber = await getBarberById(barberId);
  if (!barber) return null;
  return barber.workingHours[dayOfWeek.toLowerCase()] || null;
}

// Create a new barber
export async function createBarber(
  name: string,
  email?: string,
  phone?: string,
  bio?: string,
  workingHours?: WorkingHours
): Promise<Barber> {
  const sql = getSql();
  const result = await sql`
    INSERT INTO barbers (name, email, phone, bio, working_hours)
    VALUES (${name}, ${email || null}, ${phone || null}, ${bio || null}, ${JSON.stringify(workingHours) || null})
    RETURNING id, user_id, name, email, phone, bio, avatar_url, working_hours, is_active
  `;
  const row = result[0];
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    workingHours: row.working_hours as WorkingHours,
    isActive: row.is_active,
  } as Barber;
}

// Update barber working hours
export async function updateBarberWorkingHours(
  barberId: number,
  workingHours: WorkingHours
): Promise<boolean> {
  const sql = getSql();
  const result = await sql`
    UPDATE barbers
    SET working_hours = ${JSON.stringify(workingHours)}, updated_at = NOW()
    WHERE id = ${barberId}
    RETURNING id
  `;
  return result.length > 0;
}
