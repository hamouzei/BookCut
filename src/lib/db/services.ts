import { getSql } from './index';
import type { Service } from '@/types';

// Get all active services
export async function getServices(): Promise<Service[]> {
  const sql = getSql();
  const result = await sql`
    SELECT id, name, description, duration, price, is_active
    FROM services
    WHERE is_active = true
    ORDER BY name
  `;
  return result as Service[];
}

// Get service by ID
export async function getServiceById(id: number): Promise<Service | null> {
  const sql = getSql();
  const result = await sql`
    SELECT id, name, description, duration, price, is_active
    FROM services
    WHERE id = ${id}
  `;
  return (result[0] as Service) || null;
}

// Create a new service
export async function createService(
  name: string,
  description: string,
  duration: number,
  price: number
): Promise<Service> {
  const sql = getSql();
  const result = await sql`
    INSERT INTO services (name, description, duration, price)
    VALUES (${name}, ${description}, ${duration}, ${price})
    RETURNING id, name, description, duration, price, is_active
  `;
  return result[0] as Service;
}

// Update a service
export async function updateService(
  id: number,
  data: Partial<Pick<Service, 'name' | 'description' | 'duration' | 'price' | 'isActive'>>
): Promise<Service | null> {
  const sql = getSql();
  const result = await sql`
    UPDATE services
    SET 
      name = COALESCE(${data.name}, name),
      description = COALESCE(${data.description}, description),
      duration = COALESCE(${data.duration}, duration),
      price = COALESCE(${data.price}, price),
      is_active = COALESCE(${data.isActive}, is_active),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, name, description, duration, price, is_active
  `;
  return (result[0] as Service) || null;
}

// Delete (deactivate) a service
export async function deleteService(id: number): Promise<boolean> {
  const sql = getSql();
  const result = await sql`
    UPDATE services
    SET is_active = false, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id
  `;
  return result.length > 0;
}
