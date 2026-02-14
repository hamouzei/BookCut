'use client';

import { useEffect, useState } from 'react';
import { Barber } from '@/types';

export function BarbersShowcase() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/barbers')
      .then(res => res.json())
      .then(data => { if (data.success) setBarbers(data.data); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-44 bg-[#1E293B]/60 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (barbers.length === 0) {
    return <p className="text-center text-[#64748B] py-8">No barbers available yet.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {barbers.map((barber) => (
        <div
          key={barber.id}
          className="group bg-[#1E293B]/60 border border-[#1E293B] rounded-2xl p-6 hover:border-[#F5B700]/25 transition-all duration-300 flex flex-col items-center text-center"
        >
          <div className="h-16 w-16 rounded-full bg-[#F5B700]/15 mb-4 flex items-center justify-center text-xl font-bold text-[#F5B700] group-hover:bg-[#F5B700]/25 transition-colors overflow-hidden">
            {barber.avatarUrl ? (
              <img src={barber.avatarUrl} alt={barber.name} className="h-full w-full object-cover" />
            ) : (
              barber.name.charAt(0)
            )}
          </div>
          <h3 className="text-base font-bold text-[#F8FAFC] mb-1 group-hover:text-[#F5B700] transition-colors">{barber.name}</h3>
          <p className="text-[#94A3B8] text-sm leading-relaxed line-clamp-2">{barber.bio || 'Professional Barber'}</p>
        </div>
      ))}
    </div>
  );
}
