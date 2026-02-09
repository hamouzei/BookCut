'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { Booking } from '@/types';
import { format } from 'date-fns';

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        const data = await res.json();
        if (data.success) {
          setBooking(data.data);
        }
      } catch (err) {
        console.error('Error fetching booking details', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchBooking();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Booking Not Found</h1>
          <p className="text-slate-600 mb-6">We couldn&apos;t find the booking you&apos;re looking for.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h1>
          <p className="mt-2 text-slate-600">
            Thank you, {booking.customerName}. Your appointment has been successfully scheduled.
          </p>
        </div>

        <Card className="overflow-hidden shadow-xl border-t-4 border-amber-500">
          <div className="bg-white p-8">
            <h2 className="text-xl font-semibold mb-6 text-slate-900">Appointment Details</h2>
            
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-slate-500">Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  {booking.status}
                </span>
              </div>
              
              <div className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">Service</span>
                <span className="font-semibold text-slate-900">{booking.serviceName || 'Standard Cut'}</span>
              </div>

              <div className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">Barber</span>
                <span className="font-semibold text-slate-900">{booking.barberName || 'Expert Barber'}</span>
              </div>

              <div className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold text-slate-900">
                  {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">Time</span>
                <span className="font-semibold text-slate-900">{booking.startTime}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Ref #</span>
                <span className="font-mono text-slate-400">BC-{booking.id.toString().padStart(6, '0')}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 px-8 py-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bookings">
              <Button variant="outline" className="w-full sm:w-auto">View My Bookings</Button>
            </Link>
            <Link href="/">
              <Button className="w-full sm:w-auto">Back to Home</Button>
            </Link>
          </div>
        </Card>
        
        <p className="mt-8 text-sm text-slate-500">
          A confirmation email has been sent to {booking.customerEmail}.
        </p>
      </div>
    </div>
  );
}
