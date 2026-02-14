import { getBarberById, getBarbers } from '@/lib/db/barbers';
import { getBookingsByBarberAndDate } from '@/lib/db/bookings';
import { getBlockedTimes } from '@/lib/db/blocked-times';
import { getServiceById } from '@/lib/db/services';
import { generateTimeSlots } from '@/lib/utils';
import { TimeSlot } from '@/types';

interface AvailabilityRequest {
  barberId: number;
  date: string;
  serviceId?: number;
}

interface AvailabilityResponse {
  barber: { id: number; name: string };
  slots: TimeSlot[];
  message?: string;
}

/**
 * Core engine to calculate availability for a specific barber on a specific date.
 */
export async function calculateAvailability(
  { barberId, date, serviceId }: AvailabilityRequest
): Promise<AvailabilityResponse | null> {
  // Parse date parts directly to avoid timezone issues
  const [year, month, day] = date.split('-').map(Number);
  // Create date at noon to avoid timezone shifts
  const requestedDate = new Date(year, month - 1, day, 12, 0, 0);

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // 1. Get Barber Details & Working Hours
  const barber = await getBarberById(barberId);
  if (!barber) return null;

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayOfWeek = dayNames[requestedDate.getDay()];
  const workingHours = barber.workingHours[dayOfWeek];

  if (!workingHours || !workingHours.isWorking) {
    return {
      barber: { id: barber.id, name: barber.name },
      slots: [],
      message: 'Barber is not working on this day'
    };
  }

  // 2. Determine Slot Duration
  let slotDuration = 30; // default 30 minutes
  if (serviceId) {
    const service = await getServiceById(serviceId);
    if (service) slotDuration = service.duration;
  }

  // 3. Generate All Potential Slots
  const allSlots = generateTimeSlots(workingHours.start, workingHours.end, slotDuration);

  // 4. Fetch Existing Bookings & Blocked Times
  const bookings = await getBookingsByBarberAndDate(barberId, date);
  const blockedTimes = await getBlockedTimes(barberId, date);

  // 5. Check for Full Day Block
  const isAllDayBlocked = blockedTimes.some(bt => bt.isAllDay);
  if (isAllDayBlocked) {
    return {
      barber: { id: barber.id, name: barber.name },
      slots: [],
      message: 'Barber is not available on this day'
    };
  }

  // 6. Filter Slots Based on Conflicts
  const availableSlots = allSlots.map(slotTime => {
    const [hours, mins] = slotTime.split(':').map(Number);
    const slotStart = hours * 60 + mins;
    const slotEnd = slotStart + slotDuration;

    // Conflict with Bookings
    const hasBookingConflict = bookings.some(booking => {
      const [bStartH, bStartM] = booking.startTime.split(':').map(Number);
      const [bEndH, bEndM] = booking.endTime.split(':').map(Number);
      const bookingStart = bStartH * 60 + bStartM;
      const bookingEnd = bEndH * 60 + bEndM;
      // Overlap logic: Start < End AND End > Start
      return (slotStart < bookingEnd && slotEnd > bookingStart);
    });

    // Conflict with Blocked Times
    const hasBlockedConflict = blockedTimes.some(blocked => {
      const [btStartH, btStartM] = blocked.startTime.split(':').map(Number);
      const [btEndH, btEndM] = blocked.endTime.split(':').map(Number);
      const blockedStart = btStartH * 60 + btStartM;
      const blockedEnd = btEndH * 60 + btEndM;
      return (slotStart < blockedEnd && slotEnd > blockedStart);
    });

    // Conflict with Past Time (if today)
    let isPast = false;
    if (date === todayStr) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      isPast = slotStart <= currentMinutes + 30; // 30 min buffer
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

/**
 * Calculate availability for all active barbers.
 */
export async function calculateAllBarbersAvailability(
  date: string,
  serviceId?: number
): Promise<Record<number, TimeSlot[]>> {
  const barbers = await getBarbers();
  const availabilityPromises = barbers.map(b =>
    calculateAvailability({ barberId: b.id, date, serviceId })
  );

  const results = await Promise.all(availabilityPromises);

  return results.reduce((acc, curr) => {
    if (curr && !curr.message) {
      acc[curr.barber.id] = curr.slots;
    }
    return acc;
  }, {} as Record<number, TimeSlot[]>);
}

/**
 * Validate if a specific slot is available for booking.
 * Checks working hours, existing bookings, and blocked times.
 */
export async function validateSlotAvailability(
  { barberId, date, startTime, serviceId }: AvailabilityRequest & { startTime: string }
): Promise<{ isValid: boolean; error?: string }> {
  // Parse date parts directly to avoid timezone issues
  const [year, month, day] = date.split('-').map(Number);
  const requestedDate = new Date(year, month - 1, day, 12, 0, 0);

  const now = new Date();
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);

  // 1. Check if date is in the past
  if (requestedDate < todayDate) {
    return { isValid: false, error: 'Cannot book active dates in the past' };
  }

  // 2. Get Barber & Working Hours
  const barber = await getBarberById(barberId);
  if (!barber) return { isValid: false, error: 'Barber not found' };

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayOfWeek = dayNames[requestedDate.getDay()];
  const workingHours = barber.workingHours[dayOfWeek];

  if (!workingHours || !workingHours.isWorking) {
    return { isValid: false, error: 'Barber is not working on this day' };
  }

  // 3. Determine Duration & End Time
  let slotDuration = 30;
  if (serviceId) {
    const service = await getServiceById(serviceId);
    if (service) slotDuration = service.duration;
  }

  const [startH, startM] = startTime.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = startMinutes + slotDuration;

  // Working Hours Check
  const [workStartH, workStartM] = workingHours.start.split(':').map(Number);
  const [workEndH, workEndM] = workingHours.end.split(':').map(Number);
  const workStartMinutes = workStartH * 60 + workStartM;
  const workEndMinutes = workEndH * 60 + workEndM;

  if (startMinutes < workStartMinutes || endMinutes > workEndMinutes) {
    return { isValid: false, error: 'Slot is outside working hours' };
  }

  // 4. Overlap Checks (Bookings & Blocks)
  const bookings = await getBookingsByBarberAndDate(barberId, date);
  const blockedTimes = await getBlockedTimes(barberId, date);

  if (blockedTimes.some(bt => bt.isAllDay)) {
    return { isValid: false, error: 'Barber is not available on this day' };
  }

  const hasBookingConflict = bookings.some(booking => {
    const [bStartH, bStartM] = booking.startTime.split(':').map(Number);
    const [bEndH, bEndM] = booking.endTime.split(':').map(Number);
    const bookingStart = bStartH * 60 + bStartM;
    const bookingEnd = bEndH * 60 + bEndM;
    return (startMinutes < bookingEnd && endMinutes > bookingStart);
  });

  if (hasBookingConflict) {
    return { isValid: false, error: 'Slot overlaps with an existing appointment' };
  }

  const hasBlockedConflict = blockedTimes.some(blocked => {
    const [btStartH, btStartM] = blocked.startTime.split(':').map(Number);
    const [btEndH, btEndM] = blocked.endTime.split(':').map(Number);
    const blockedStart = btStartH * 60 + btStartM;
    const blockedEnd = btEndH * 60 + btEndM;
    return (startMinutes < blockedEnd && endMinutes > blockedStart);
  });

  if (hasBlockedConflict) {
    return { isValid: false, error: 'Slot overlaps with a blocked time' };
  }

  return { isValid: true };
}
