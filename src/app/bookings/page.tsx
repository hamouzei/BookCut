'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { Booking } from '@/types';
import { format } from 'date-fns';
import Link from 'next/link';

export default function MyBookingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login?redirect=/bookings');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.success) {
          setBookings(data.data);
        }
      } catch (err) {
        console.error('Error fetching bookings', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (session) fetchBookings();
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
          <Link href="/book">
            <Button size="sm">New Booking</Button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4 text-slate-300">📅</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No bookings yet</h2>
            <p className="text-slate-600 mb-6">You haven&apos;t scheduled any appointments yet.</p>
            <Link href="/book">
              <Button>Book Your First Appointment</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((booking) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 sm:flex items-center justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">BC-{booking.id.toString().padStart(6, '0')}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{booking.serviceName || 'Standard Cut'}</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {format(new Date(booking.date), 'EEE, MMM d, yyyy')}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {booking.startTime}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {booking.barberName || 'Expert Barber'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex items-center gap-3">
                    {booking.status === 'confirmed' && (
                       <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={async () => {
                            if (!confirm('Mark this appointment as completed?')) return;
                            try {
                                const res = await fetch(`/api/bookings/${booking.id}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'completed' })
                                });
                                if (res.ok) {
                                    // Refresh list
                                    const refreshed = await fetch('/api/bookings').then(r => r.json());
                                    if (refreshed.success) setBookings(refreshed.data);
                                }
                            } catch (e) {
                                console.error(e);
                            }
                        }}
                       >
                        Mark Complete
                       </Button>
                    )}
                    <Link href={`/bookings/${booking.id}/confirmation`}>
                      <Button variant="outline" size="sm">Details</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
