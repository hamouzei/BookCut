import { NextResponse } from 'next/server';
import { createBooking, getAllBookings, isSlotAvailable } from '@/lib/db/bookings';
import { getServiceById } from '@/lib/db/services';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/bookings - Get all bookings (admin) or user bookings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') as 'pending' | 'confirmed' | 'cancelled' | 'completed' | null;

    const result = await getAllBookings(page, limit, status || undefined);
    return NextResponse.json({
      success: true,
      data: result.bookings,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      barberId,
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      date,
      startTime,
      notes
    } = body;

    // Validate required fields
    if (!barberId || !serviceId || !customerName || !customerEmail || !date || !startTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get service to calculate end time
    const service = await getServiceById(serviceId);
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    // Calculate end time based on service duration
    const [hours, minutes] = startTime.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + service.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

    // Check slot availability
    const available = await isSlotAvailable(barberId, date, startTime, endTime);
    if (!available) {
      return NextResponse.json(
        { success: false, error: 'This time slot is no longer available' },
        { status: 409 }
      );
    }

    // Create the booking
    const booking = await createBooking({
      barberId,
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      date,
      startTime,
      endTime,
      notes,
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
