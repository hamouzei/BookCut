import { NextResponse } from 'next/server';
import { getBarbers, createBarber } from '@/lib/db/barbers';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/barbers - Get all active barbers
export async function GET() {
  try {
    const barbers = await getBarbers();
    return NextResponse.json({ success: true, data: barbers });
  } catch (error) {
    console.error('Error fetching barbers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch barbers' },
      { status: 500 }
    );
  }
}

// POST /api/barbers - Create a new barber (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, bio, workingHours } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const barber = await createBarber(name, email, phone, bio, workingHours);
    return NextResponse.json({ success: true, data: barber }, { status: 201 });
  } catch (error) {
    console.error('Error creating barber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create barber' },
      { status: 500 }
    );
  }
}
