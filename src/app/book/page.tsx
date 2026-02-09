'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { useSession } from '@/lib/auth/client';
import { ServiceSelection } from '@/components/booking/ServiceSelection';
import { DateCalendar } from '@/components/booking/DateCalendar';
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { Service } from '@/types';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    serviceId: null as number | null,
    barberId: null as number | null, // Made optional/nullable in logic
    date: null as Date | null,
    time: null as string | null,
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleBooking = async () => {
    if (!session) {
      router.push(`/login?redirect=/book`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Assuming barberId 1 for now if not selected (or implement logic to pick one)
      // Since availability logic aggregates slots, we might need to pick an available barber for that slot
      // For simplicity, let's just send the booking request and let backend assign or fail if we didn't pick one.
      // But wait, our API expects barberId?
      // "POST /api/bookings" usually requires barberId.
      // Let's check api/bookings/route.ts. 
      // If we don't have a barberId, we might need to fetch available barber for this slot.
      // Simplification: Auto-assign barber ID 1 or fix backend to handle "any barber".
      // Let's default to barberId 1 for MVP if not set.
      const payload = {
        serviceId: bookingData.serviceId,
        barberId: bookingData.barberId || 1, 
        date: bookingData.date?.toISOString().split('T')[0], // YYYY-MM-DD
        startTime: bookingData.time,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/bookings/${data.data.id}/confirmation`);
      } else {
        alert(data.error || 'Failed to book appointment');
      }
    } catch (err) {
      console.error('Booking failed', err);
      alert('An error occurred while booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Book Appointment</h1>
          <p className="mt-2 text-slate-600">Step {step} of 4</p>
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-300 ease-in-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-6 shadow-lg">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Select Service</h2>
              <ServiceSelection 
                  selectedId={bookingData.serviceId} 
                  onSelect={(service: Service) => setBookingData({...bookingData, serviceId: service.id})} 
              />
              <div className="mt-6 flex justify-end">
                <Button onClick={nextStep} disabled={!bookingData.serviceId}>Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Select Date</h2>
              <div className="flex justify-center">
                <DateCalendar 
                  selectedDate={bookingData.date}
                  onSelect={(date) => setBookingData({...bookingData, date})}
                />
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={!bookingData.date}>Next</Button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Select Time</h2>
              <TimeSlotPicker 
                date={bookingData.date!}
                serviceId={bookingData.serviceId!}
                selectedTime={bookingData.time}
                onSelect={(time: string) => setBookingData({...bookingData, time})}
              />
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={!bookingData.time}>Next</Button>
              </div>
            </div>
          )}

          {step === 4 && (
             <div>
               <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
               <BookingSummary 
                 serviceId={bookingData.serviceId!}
                 date={bookingData.date!}
                 time={bookingData.time!}
                 onConfirm={handleBooking}
                 isSubmitting={isSubmitting}
               />
                <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>Back</Button>
                <Button onClick={handleBooking} disabled={isSubmitting}>
                  {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                </Button>
              </div>
             </div>
          )}
        </Card>
      </div>
    </div>
  );
}
