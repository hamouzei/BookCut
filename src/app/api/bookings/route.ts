import { NextResponse } from 'next/server';
import { createBooking, getAllBookings } from '@/lib/db/bookings';
import { getServiceById } from '@/lib/db/services';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { validateSlotAvailability } from '@/lib/engine/availability';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/bookings - Get all bookings (admin) or user bookings
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') as 'pending' | 'confirmed' | 'cancelled' | 'completed' | null;

    // If regular user, only show their bookings
    let userEmail = undefined;
    if (session?.user && session.user.role !== 'admin') {
      userEmail = session.user.email;
    }

    const result = await getAllBookings(page, limit, status || undefined, userEmail);
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
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const body = await request.json();
    const {
      barberId,
      serviceId,
      customerPhone,
      date,
      startTime,
      notes
    } = body;

    // Use session user details if available, otherwise require from body
    const customerName = body.customerName || session?.user?.name;
    const customerEmail = body.customerEmail || session?.user?.email;

    // Validate required fields
    if (!barberId || !serviceId || !customerName || !customerEmail || !date || !startTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (barberId, serviceId, customerName, customerEmail, date, or startTime)' },
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

    // Check slot availability (using strict engine validation)
    const validation = await validateSlotAvailability({
      barberId,
      date,
      startTime,
      serviceId
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error || 'This time slot is no longer available' },
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

    // Send Confirmation Email (Async - don't block response)
    (async () => {
      try {
        const { sendEmail } = await import('@/lib/email');
        const { getBookingConfirmationTemplate } = await import('@/lib/email/templates');

        await sendEmail({
          to: customerEmail,
          subject: 'Booking Confirmed - Barbershop',
          html: getBookingConfirmationTemplate(booking),
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email', emailError);
      }
    })();

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
