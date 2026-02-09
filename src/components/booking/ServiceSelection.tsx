'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui';
import { Service } from '@/types';

interface ServiceSelectionProps {
  selectedId: number | null;
  onSelect: (service: Service) => void;
}

export function ServiceSelection({ selectedId, onSelect }: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success) {
          setServices(data.data);
        } else {
          setError('Failed to load services');
        }
      } catch (err) {
        setError('Error loading services');
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, []);

  if (isLoading) return <div className="text-center py-8">Loading services...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {services.map((service) => (
        <div
          key={service.id}
          className={`
            relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md
            ${selectedId === service.id 
              ? 'border-amber-500 bg-amber-50' 
              : 'border-slate-100 hover:border-amber-200 bg-white'}
          `}
          onClick={() => onSelect(service)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-slate-900">{service.name}</h3>
            <span className="font-medium text-amber-600">${service.price}</span>
          </div>
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">{service.description}</p>
          <div className="flex items-center text-xs text-slate-400">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {service.duration} mins
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
