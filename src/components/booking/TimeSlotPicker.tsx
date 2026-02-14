'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui';

interface TimeSlotPickerProps {
  date: Date;
  serviceId: number;
  barberId?: number | null;
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlotPicker({ date, serviceId, barberId, selectedTime, onSelect }: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSlots() {
      setIsLoading(true);
      setError('');
      try {
        const dateStr = format(date, 'yyyy-MM-dd');
        let url = `/api/availability?date=${dateStr}&serviceId=${serviceId}`;
        if (barberId) {
            url += `&barberId=${barberId}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        if (data.success) {
          const allSlots = new Set<string>();
          
          if (barberId) {
            // Response is { barber: ..., slots: [...] }
            const responseData = data.data as { slots: { time: string; available: boolean }[] };
            if (responseData.slots && Array.isArray(responseData.slots)) {
                responseData.slots.forEach(slot => {
                    if (slot.available) allSlots.add(slot.time);
                });
            }
          } else {
            // Response is Record<barberId, slots[]>
            Object.values(data.data as Record<string, { time: string; available: boolean }[]>).forEach(barberSlots => {
                barberSlots.forEach(slot => {
                if (slot.available) {
                    allSlots.add(slot.time);
                }
                });
            });
          }
          
          setSlots(Array.from(allSlots).sort());
        } else {
          setError('Failed to load time slots');
        }
      } catch (err) {
        setError('Error loading time slots');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (date && serviceId) {
      fetchSlots();
    }
  }, [date, serviceId, barberId]);

  if (isLoading) return <div className="text-center py-8 text-[#94A3B8]">Loading available times...</div>;
  if (error) return <div className="text-center py-8 text-red-400">{error}</div>;
  if (slots.length === 0) return <div className="text-center py-8 text-[#94A3B8]">No slots available for this date.</div>;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {slots.map((time) => (
        <Button
          key={time}
          variant={selectedTime === time ? 'primary' : 'outline'}
          className={selectedTime === time ? 'bg-[#F5B700] hover:bg-[#FFC933]' : 'border-[#1E293B] text-[#94A3B8] hover:border-[#F5B700]/50 hover:text-[#F5B700]'}
          onClick={() => onSelect(time)}
        >
          {time}
        </Button>
      ))}
    </div>
  );
}
