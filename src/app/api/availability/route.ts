import { NextResponse } from 'next/server';
import { getBarberById, getBarbers } from '@/lib/db/barbers';
import { getBookingsByBarberAndDate } from '@/lib/db/bookings';
import { getBlockedTimes } from '@/lib/db/blocked-times';
import { getServiceById } from '@/lib/db/services';
import { generateTimeSlots } from '@/lib/utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getBarberAvailability(barberId: number, date: string, serviceId?: string | null) {
  const requestedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const barber = await getBarberById(barberId);
  if (!barber) return null;

  const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const workingHours = barber.workingHours[dayOfWeek];

  if (!workingHours || !workingHours.isWorking) {
    return { slots: [], message: 'Barber is not working on this day' };
  }

  let slotDuration = 30; // default 30 minutes
  if (serviceId) {
    const service = await getServiceById(parseInt(serviceId));
    if (service) slotDuration = service.duration;
  }

  const allSlots = generateTimeSlots(workingHours.start, workingHours.end, slotDuration);
  const bookings = await getBookingsByBarberAndDate(barberId, date);
  const blockedTimes = await getBlockedTimes(barberId, date);

  const isAllDayBlocked = blockedTimes.some(bt => bt.isAllDay);
  if (isAllDayBlocked) return { slots: [], message: 'Barber is not available on this day' };

  const availableSlots = allSlots.map(slotTime => {
    const [hours, mins] = slotTime.split(':').map(Number);
    const slotStart = hours * 60 + mins;
    const slotEnd = slotStart + slotDuration;

    const hasBookingConflict = bookings.some(booking => {
      const [bStartH, bStartM] = booking.startTime.split(':').map(Number);
      const [bEndH, bEndM] = booking.endTime.split(':').map(Number);
      const bookingStart = bStartH * 60 + bStartM;
      const bookingEnd = bEndH * 60 + bEndM;
      return (slotStart < bookingEnd && slotEnd > bookingStart);
    });

    const hasBlockedConflict = blockedTimes.some(blocked => {
      const [btStartH, btStartM] = blocked.startTime.split(':').map(Number);
      const [btEndH, btEndM] = blocked.endTime.split(':').map(Number);
      const blockedStart = btStartH * 60 + btStartM;
      const blockedEnd = btEndH * 60 + btEndM;
      return (slotStart < blockedEnd && slotEnd > blockedStart);
    });

    let isPast = false;
    if (date === today.toISOString().split('T')[0]) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      isPast = slotStart <= currentMinutes + 30;
    }

    return {
      time: slotTime,
      available: !hasBookingConflict && !hasBlockedConflict && !isPast,
    };
  });

  return {
    barber: { id: barber.id, name: barber.name },
    slots: availableSlots
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get('barberId');
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!date) {
      return NextResponse.json({ success: false, error: 'date is required' }, { status: 400 });
    }

    if (barberId) {
      const availability = await getBarberAvailability(parseInt(barberId), date, serviceId);
      if (!availability) {
        return NextResponse.json({ success: false, error: 'Barber not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: availability });
    } else {
      // Fetch availability for all active barbers
      const barbers = await getBarbers();
      const availabilityPromises = barbers.map(b => getBarberAvailability(b.id, date, serviceId));
      const results = await Promise.all(availabilityPromises);

      const filteredResults = results.filter(r => r !== null && !('message' in r));

      return NextResponse.json({
        success: true,
        data: filteredResults.reduce((acc, curr: any) => {
          if (curr?.barber) acc[curr.barber.id] = curr.slots;
          return acc;
        }, {} as any)
      });
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch availability' }, { status: 500 });
  }
}
