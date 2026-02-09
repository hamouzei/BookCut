'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card, Button } from '@/components/ui';
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

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter]);

  async function fetchBookings() {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (statusFilter) query.set('status', statusFilter);

      const res = await fetch(`/api/bookings?${query.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setBookings(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStatusChange = (newStatus: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (newStatus) {
      params.set('status', newStatus);
    } else {
      params.delete('status');
    }
    params.set('page', '1'); // Reset to page 1
    router.push(`${pathname}?${params.toString()}`);
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
        <div className="flex gap-2">
            {/* Filter Buttons */}
            {['pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                <Button 
                    key={status}
                    size="sm"
                    variant={statusFilter === status ? 'primary' : 'outline'}
                    onClick={() => handleStatusChange(statusFilter === status ? null : status)}
                    className="capitalize"
                >
                    {status}
                </Button>
            ))}
            {(statusFilter) && (
                 <Button size="sm" variant="ghost" onClick={() => handleStatusChange(null)}>
                    Clear Filter
                 </Button>
            )}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reference</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Barber</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">Loading bookings...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">No bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">
                      BC-{booking.id.toString().padStart(6, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{booking.customerName}</div>
                      <div className="text-sm text-slate-500">{booking.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{format(new Date(booking.date), 'MMM d, yyyy')}</div>
                      <div className="text-sm text-slate-500">{booking.startTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {booking.serviceName || 'Standard Service'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {booking.barberName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full 
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-800'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`/bookings/${booking.id}/confirmation`} target="_blank" className="text-amber-600 hover:text-amber-900">View</a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isLoading && pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                    <Button 
                        size="sm" variant="outline" 
                        disabled={page <= 1}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        Previous
                    </Button>
                    <Button 
                        size="sm" variant="outline" 
                        disabled={page >= pagination.totalPages}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        Next
                    </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-700">
                            Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <Button
                                variant="outline"
                                className="rounded-l-md px-2 py-2"
                                disabled={page <= 1}
                                onClick={() => handlePageChange(page - 1)}
                            >
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </Button>
                            {/* Simple page numbers */}
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                        ${page === i + 1 
                                            ? 'z-10 bg-amber-50 border-amber-500 text-amber-600' 
                                            : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <Button
                                variant="outline"
                                className="rounded-r-md px-2 py-2"
                                disabled={page >= pagination.totalPages}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </Button>
                        </nav>
                    </div>
                </div>
            </div>
        )}
      </Card>
    </div>
  );
}
