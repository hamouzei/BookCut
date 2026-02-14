'use client';

import { useEffect, useState } from 'react';
import { Service } from '@/types';

export function ServicesShowcase() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => { if (data.success) setServices(data.data); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-36 bg-[#1E293B]/60 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return <p className="text-center text-[#64748B] py-8">No services available yet.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <div
          key={service.id}
          className="group bg-[#1E293B]/60 border border-[#1E293B] rounded-2xl p-5 hover:border-[#F5B700]/25 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#F5B700] transition-colors">{service.name}</h3>
            <span className="bg-[#F5B700]/15 text-[#F5B700] text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap ml-2">
              ${service.price}
            </span>
          </div>
          <p className="text-[#94A3B8] text-sm leading-relaxed mb-3 line-clamp-2">{service.description}</p>
          <div className="flex items-center text-xs text-[#64748B]">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {service.duration} mins
          </div>
        </div>
      ))}
    </div>
  );
}
