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

  if (isLoading) return <div className="text-[#94A3B8]">Loading summary...</div>;
  if (!service) return <div className="text-red-400">Service not found</div>;

  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] p-6 rounded-xl border border-[#1E293B]">
        <h3 className="font-semibold text-lg mb-4 text-[#F8FAFC] border-b border-[#1E293B] pb-2">Booking Details</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Service</span>
            <span className="font-medium text-[#F8FAFC]">{service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Date</span>
            <span className="font-medium text-[#F8FAFC]">{format(date, 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Time</span>
            <span className="font-medium text-[#F8FAFC]">{time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Duration</span>
            <span className="font-medium text-[#F8FAFC]">{service.duration} mins</span>
          </div>
          <div className="pt-3 border-t border-[#1E293B] flex justify-between items-center">
            <span className="text-[#94A3B8]">Total Price</span>
            <span className="font-bold text-xl text-[#F5B700]">${service.price}</span>
          </div>
        </div>
      </div>

      <div className="text-sm text-[#64748B] text-center">
        Please review your booking details before confirming.
      </div>
    </div>
  );
}
