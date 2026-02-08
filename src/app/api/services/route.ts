import { NextResponse } from 'next/server';
import { getServices, createService } from '@/lib/db/services';

// Force dynamic rendering (not static) to avoid build-time database access
export const dynamic = 'force-dynamic';

// GET /api/services - Get all active services
export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST /api/services - Create a new service (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, duration, price } = body;

    // Validate required fields
    if (!name || !duration || !price) {
      return NextResponse.json(
        { success: false, error: 'Name, duration, and price are required' },
        { status: 400 }
      );
    }

    const service = await createService(name, description || '', duration, price);
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
