import { NextResponse } from 'next/server';
import { getBarberById, getBarberWorkingHours } from '@/lib/db/barbers';
import { getBookingsByBarberAndDate } from '@/lib/db/bookings';
import { getBlockedTimes } from '@/lib/db/blocked-times';
import { getServiceById } from '@/lib/db/services';
import { generateTimeSlots } from '@/lib/utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/availability?barberId=1&date=2024-01-15&serviceId=1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get('barberId');
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    // Validate required params
    if (!barberId || !date) {
      return NextResponse.json(
        { success: false, error: 'barberId and date are required' },
        { status: 400 }
      );
    }

    // Check if date is in the past
    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
      return NextResponse.json(
        { success: false, error: 'Cannot book dates in the past' },
        { status: 400 }
      );
    }

    // Get barber
    const barber = await getBarberById(parseInt(barberId));
    if (!barber) {
      return NextResponse.json(
        { success: false, error: 'Barber not found' },
        { status: 404 }
      );
    }

    // Get day of week
    const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Get working hours for the day
    const workingHours = await getBarberWorkingHours(parseInt(barberId), dayOfWeek);
    if (!workingHours || !workingHours.isWorking) {
      return NextResponse.json({
        success: true,
        data: {
          slots: [],
          message: 'Barber is not working on this day'
        }
      });
    }

    // Get service duration if provided
    let slotDuration = 30; // default 30 minutes
    if (serviceId) {
      const service = await getServiceById(parseInt(serviceId));
      if (service) {
        slotDuration = service.duration;
      }
    }

    // Generate all possible time slots
    const allSlots = generateTimeSlots(workingHours.start, workingHours.end, slotDuration);

    // Get existing bookings for the day
    const bookings = await getBookingsByBarberAndDate(parseInt(barberId), date);

    // Get blocked times for the day
    const blockedTimes = await getBlockedTimes(parseInt(barberId), date);

    // Check if any blocked time is all day
    const isAllDayBlocked = blockedTimes.some(bt => bt.isAllDay);
    if (isAllDayBlocked) {
      return NextResponse.json({
        success: true,
        data: {
          slots: [],
          message: 'Barber is not available on this day'
        }
      });
    }

    // Filter available slots
    const availableSlots = allSlots.map(slotTime => {
      const [hours, mins] = slotTime.split(':').map(Number);
      const slotStart = hours * 60 + mins;
      const slotEnd = slotStart + slotDuration;

      // Check if slot overlaps with any booking
      const hasBookingConflict = bookings.some(booking => {
        const [bStartH, bStartM] = booking.startTime.split(':').map(Number);
        const [bEndH, bEndM] = booking.endTime.split(':').map(Number);
        const bookingStart = bStartH * 60 + bStartM;
        const bookingEnd = bEndH * 60 + bEndM;

        return (slotStart < bookingEnd && slotEnd > bookingStart);
      });

      // Check if slot overlaps with any blocked time
      const hasBlockedConflict = blockedTimes.some(blocked => {
        const [btStartH, btStartM] = blocked.startTime.split(':').map(Number);
        const [btEndH, btEndM] = blocked.endTime.split(':').map(Number);
        const blockedStart = btStartH * 60 + btStartM;
        const blockedEnd = btEndH * 60 + btEndM;

        return (slotStart < blockedEnd && slotEnd > blockedStart);
      });

      // For today, filter out past slots
      let isPast = false;
      if (date === today.toISOString().split('T')[0]) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        isPast = slotStart <= currentMinutes + 30; // 30 minute buffer
      }

      return {
        time: slotTime,
        available: !hasBookingConflict && !hasBlockedConflict && !isPast,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        barber: { id: barber.id, name: barber.name },
        date,
        slots: availableSlots,
      }
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
