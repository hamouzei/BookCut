'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { useSession } from '@/lib/auth/client';
import { ServiceSelection } from '@/components/booking/ServiceSelection';
import { BarberSelection } from '@/components/booking/BarberSelection';
import { DateCalendar } from '@/components/booking/DateCalendar';
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { Service, Barber } from '@/types';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    serviceId: null as number | null,
    barberId: null as number | null,
    date: null as Date | null,
    time: null as string | null,
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleBooking = async () => {
    // Don't redirect if session is still loading
    if (isPending) {
      return;
    }
    
    if (!session) {
      router.push(`/login?redirect=/book`);
      return;
    }

    if (!bookingData.barberId) {
        alert('Please select a barber');
        return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        serviceId: bookingData.serviceId,
        barberId: bookingData.barberId, 
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

  // Show loading state while checking session
  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Book Appointment</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">Step {step} of 5</p>
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-300 ease-in-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-4 sm:p-6 shadow-lg">
          {step === 1 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Select Service</h2>
              <ServiceSelection 
                  selectedId={bookingData.serviceId} 
                  onSelect={(service: Service) => setBookingData({...bookingData, serviceId: service.id})} 
              />
              <div className="mt-6 flex justify-end">
                <Button onClick={nextStep} disabled={!bookingData.serviceId} className="w-full sm:w-auto">Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Select Barber</h2>
              <BarberSelection 
                  selectedId={bookingData.barberId} 
                  onSelect={(barber: Barber) => setBookingData({...bookingData, barberId: barber.id})} 
              />
              <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
                <Button variant="outline" onClick={prevStep} className="w-full sm:w-auto">Back</Button>
                <Button onClick={nextStep} disabled={!bookingData.barberId} className="w-full sm:w-auto">Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Select Date</h2>
              <div className="flex justify-center">
                <DateCalendar 
                  selectedDate={bookingData.date}
                  onSelect={(date) => setBookingData({...bookingData, date})}
                />
              </div>
              <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
                <Button variant="outline" onClick={prevStep} className="w-full sm:w-auto">Back</Button>
                <Button onClick={nextStep} disabled={!bookingData.date} className="w-full sm:w-auto">Next</Button>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Select Time</h2>
              <p className="text-sm text-slate-500 mb-4">Showing available slots for your selected barber.</p>
              <TimeSlotPicker 
                date={bookingData.date!}
                serviceId={bookingData.serviceId!}
                barberId={bookingData.barberId}
                selectedTime={bookingData.time}
                onSelect={(time: string) => setBookingData({...bookingData, time})}
              />
              <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
                <Button variant="outline" onClick={prevStep} className="w-full sm:w-auto">Back</Button>
                <Button onClick={nextStep} disabled={!bookingData.time} className="w-full sm:w-auto">Next</Button>
              </div>
            </div>
          )}

          {step === 5 && (
             <div>
               <h2 className="text-lg sm:text-xl font-semibold mb-4">Confirm Booking</h2>
               <BookingSummary 
                 serviceId={bookingData.serviceId!}
                 date={bookingData.date!}
                 time={bookingData.time!}
                 onConfirm={handleBooking}
                 isSubmitting={isSubmitting}
               />
                <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
                <Button variant="outline" onClick={prevStep} disabled={isSubmitting} className="w-full sm:w-auto">Back</Button>
                <Button onClick={handleBooking} disabled={isSubmitting} className="w-full sm:w-auto">
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
