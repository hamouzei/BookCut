'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui';
import { Booking, BookingStatus } from '@/types';
import { format } from 'date-fns';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const statusFilter = searchParams.get('status') as BookingStatus | null;
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => { fetchBookings(); }, [page, statusFilter]);

  async function fetchBookings() {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({ page: page.toString(), limit: '10' });
      if (statusFilter) query.set('status', statusFilter);
      const res = await fetch(`/api/bookings?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
        setPagination(data.pagination);
      }
    } catch (error) { console.error('Failed to fetch bookings', error); }
    finally { setIsLoading(false); }
  }

  const handleStatusChange = (newStatus: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (newStatus) { params.set('status', newStatus); } else { params.delete('status'); }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  const statusColors: Record<string, string> = {
    confirmed: 'bg-green-500/15 text-green-400',
    pending: 'bg-[#F5B700]/15 text-[#F5B700]',
    cancelled: 'bg-red-500/15 text-red-400',
    completed: 'bg-[#94A3B8]/15 text-[#94A3B8]',
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">Bookings</h1>
        <div className="flex flex-wrap gap-2">
          {['pending', 'confirmed', 'completed', 'cancelled'].map(status => (
            <Button 
              key={status}
              size="sm"
              variant={statusFilter === status ? 'primary' : 'outline'}
              onClick={() => handleStatusChange(statusFilter === status ? null : status)}
              className={`capitalize text-xs ${statusFilter !== status ? 'border-[#1E293B] text-[#94A3B8] hover:border-[#F5B700]/40 hover:text-[#F5B700]' : ''}`}
            >
              {status}
            </Button>
          ))}
          {statusFilter && (
            <Button size="sm" variant="ghost" onClick={() => handleStatusChange(null)} className="text-xs text-[#64748B]">
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {isLoading ? (
          <p className="text-[#64748B] text-center py-12 text-sm">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-[#64748B] text-center py-12 text-sm">No bookings found.</p>
        ) : bookings.map((booking) => (
          <div key={booking.id} className="bg-[#1E293B]/50 border border-[#1E293B] rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#F8FAFC]">{booking.customerName}</p>
                <p className="text-xs text-[#64748B]">{booking.customerEmail}</p>
              </div>
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${statusColors[booking.status] || statusColors.completed}`}>
                {booking.status}
              </span>
            </div>
            <div className="flex justify-between text-xs text-[#94A3B8]">
              <span>{format(new Date(booking.date), 'MMM d, yyyy')} · {booking.startTime}</span>
              <span>{booking.serviceName || 'Service'}</span>
            </div>
            <div className="flex gap-2 pt-1">
              {booking.status === 'pending' && (
                <Button size="sm" className="flex-1 text-xs" onClick={async () => {
                  if (!confirm('Confirm this booking?')) return;
                  try {
                    const res = await fetch(`/api/bookings/${booking.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'confirmed' }) });
                    if (res.ok) fetchBookings();
                  } catch (e) { console.error(e); }
                }}>Confirm</Button>
              )}
              <Button variant="ghost" size="sm" className="text-xs text-red-400 hover:bg-red-500/10" onClick={async () => {
                if (!confirm('Delete this booking permanently?')) return;
                try {
                  const res = await fetch(`/api/bookings/${booking.id}`, { method: 'DELETE' });
                  if (res.ok) fetchBookings();
                } catch (e) { console.error(e); }
              }}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-[#1E293B]/30 border border-[#1E293B] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#1E293B]">
            <thead className="bg-[#0F172A]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Ref</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Barber</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-[#64748B] text-sm">Loading bookings...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-[#64748B] text-sm">No bookings found.</td></tr>
              ) : bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#1E293B]/40 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-[#64748B]">
                    BC-{booking.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#F8FAFC]">{booking.customerName}</div>
                    <div className="text-xs text-[#64748B]">{booking.customerEmail}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-[#F8FAFC]">{format(new Date(booking.date), 'MMM d')}</div>
                    <div className="text-xs text-[#64748B]">{booking.startTime}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#94A3B8]">
                    {booking.serviceName || 'Service'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#94A3B8]">
                    {booking.barberName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${statusColors[booking.status] || statusColors.completed}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right space-x-1">
                    {booking.status === 'pending' && (
                      <Button size="sm" className="text-xs" onClick={async () => {
                        if (!confirm('Confirm this booking?')) return;
                        try {
                          const res = await fetch(`/api/bookings/${booking.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'confirmed' }) });
                          if (res.ok) fetchBookings();
                        } catch (e) { console.error(e); }
                      }}>Confirm</Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={async () => {
                      if (!confirm('Delete this booking permanently?')) return;
                      try {
                        const res = await fetch(`/api/bookings/${booking.id}`, { method: 'DELETE' });
                        if (res.ok) fetchBookings();
                      } catch (e) { console.error(e); }
                    }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="border-t border-[#1E293B] px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-[#64748B]">
              {(page - 1) * 10 + 1}–{Math.min(page * 10, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => handlePageChange(page - 1)} className="text-xs border-[#1E293B] text-[#94A3B8] px-3">
                ←
              </Button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                    page === i + 1 
                      ? 'bg-[#F5B700]/15 text-[#F5B700] border border-[#F5B700]/30' 
                      : 'text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => handlePageChange(page + 1)} className="text-xs border-[#1E293B] text-[#94A3B8] px-3">
                →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
