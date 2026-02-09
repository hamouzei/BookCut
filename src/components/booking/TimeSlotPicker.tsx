'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui';

interface TimeSlotPickerProps {
  date: Date;
  serviceId: number;
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlotPicker({ date, serviceId, selectedTime, onSelect }: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSlots() {
      setIsLoading(true);
      setError('');
      try {
        const dateStr = format(date, 'yyyy-MM-dd');
        const res = await fetch(`/api/availability?date=${dateStr}&serviceId=${serviceId}`);
        const data = await res.json();
        
        if (data.success) {
          // Flatten slots from all barbers for now, or just show available times
          // This depends on API response structure. 
          // Assuming API returns { barberId: { "09:00": true, ... } } or similar
          // Let's assume a simpler array for now based on previous `route.ts` analysis if possible
          // Checking `src/app/api/availability/route.ts`...
          // It returns `Record<number, TimeSlot[]>` (barberId -> slots).
          
          // Let's aggregate all unique available times across all barbers
          const allSlots = new Set<string>();
          Object.values(data.data as Record<string, { time: string; available: boolean }[]>).forEach(barberSlots => {
            barberSlots.forEach(slot => {
              if (slot.available) {
                allSlots.add(slot.time);
              }
            });
          });
          
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
  }, [date, serviceId]);

  if (isLoading) return <div className="text-center py-8">Loading available times...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (slots.length === 0) return <div className="text-center py-8 text-slate-500">No slots available for this date.</div>;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {slots.map((time) => (
        <Button
          key={time}
          variant={selectedTime === time ? 'primary' : 'outline'}
          className={selectedTime === time ? 'bg-amber-500 hover:bg-amber-600' : ''}
          onClick={() => onSelect(time)}
        >
          {time}
        </Button>
      ))}
    </div>
  );
}
