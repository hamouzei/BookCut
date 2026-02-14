'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { Barber } from '@/types';

interface BarberSelectionProps {
  selectedId: number | null;
  onSelect: (barber: Barber) => void;
}

export function BarberSelection({ selectedId, onSelect }: BarberSelectionProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBarbers() {
      try {
        const res = await fetch('/api/barbers');
        const data = await res.json();
        if (data.success) {
          setBarbers(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch barbers', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBarbers();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-[#1E293B] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {barbers.map((barber) => (
        <div
          key={barber.id}
          className={`cursor-pointer transition-all rounded-xl border-2 p-4 flex items-center gap-4 ${
            selectedId === barber.id
              ? 'border-[#F5B700] bg-[#F5B700]/5'
              : 'border-[#1E293B] hover:border-[#F5B700]/40 bg-[#1E293B]/40'
          }`}
          onClick={() => onSelect(barber)}
        >
          <div className="h-16 w-16 rounded-full flex-shrink-0 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-[#F5B700]/15 text-[#F5B700] font-bold text-xl">
               {barber.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[#F8FAFC]">{barber.name}</h3>
            <p className="text-sm text-[#94A3B8] line-clamp-2">{barber.bio || 'Professional Barber'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
