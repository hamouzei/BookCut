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
          <div key={i} className="h-32 bg-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {barbers.map((barber) => (
        <Card
          key={barber.id}
          className={`cursor-pointer transition-all hover:shadow-md border-2 p-4 flex items-center gap-4 ${
            selectedId === barber.id
              ? 'border-amber-500 bg-amber-50'
              : 'border-transparent hover:border-slate-200'
          }`}
          onClick={() => onSelect(barber)}
        >
          <div className="h-16 w-16 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
            {/* Placeholder for avatar */}
            <div className="w-full h-full flex items-center justify-center bg-amber-100 text-amber-700 font-bold text-xl">
               {barber.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{barber.name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2">{barber.bio || 'Professional Barber'}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
