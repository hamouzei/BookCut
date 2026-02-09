'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, Button } from '@/components/ui';
import { Service } from '@/types';

interface BookingSummaryProps {
  serviceId: number;
  date: Date;
  time: string;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function BookingSummary({ serviceId, date, time, onConfirm, isSubmitting }: BookingSummaryProps) {
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/services`);
        const data = await res.json();
        if (data.success) {
          const found = data.data.find((s: Service) => s.id === serviceId);
          setService(found || null);
        }
      } catch (err) {
        console.error('Error loading service details', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchService();
  }, [serviceId]);

  if (isLoading) return <div>Loading summary...</div>;
  if (!service) return <div className="text-red-500">Service not found</div>;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
        <h3 className="font-semibold text-lg mb-4 text-slate-900 border-b pb-2">Booking Details</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-500">Service</span>
            <span className="font-medium text-slate-900">{service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Date</span>
            <span className="font-medium text-slate-900">{format(date, 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Time</span>
            <span className="font-medium text-slate-900">{time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Duration</span>
            <span className="font-medium text-slate-900">{service.duration} mins</span>
          </div>
          <div className="pt-3 border-t flex justify-between items-center">
            <span className="text-slate-500">Total Price</span>
            <span className="font-bold text-xl text-amber-600">${service.price}</span>
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-500 text-center">
        Please review your booking details before confirming.
      </div>
    </div>
  );
}
