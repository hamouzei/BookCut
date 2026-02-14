'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { DateCalendar } from '@/components/booking/DateCalendar';
import { format } from 'date-fns';
import { Barber } from '@/types';

export default function AdminSchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [blockReason, setBlockReason] = useState('Personal Time');
  const [blockStartTime, setBlockStartTime] = useState('12:00');
  const [blockEndTime, setBlockEndTime] = useState('13:00');
  const [isAllDay, setIsAllDay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchBarbers() {
      try {
        const res = await fetch('/api/barbers');
        const data = await res.json();
        if (data.success) {
          setBarbers(data.data);
          if (data.data.length > 0) setSelectedBarberId(data.data[0].id);
        }
      } catch(e) { console.error(e); } finally { setIsLoading(false); }
    }
    fetchBarbers();
  }, []);

  const handleBlockTime = async () => {
    if (!selectedDate || !selectedBarberId) return;
    setIsSubmitting(true);
    try {
      const payload = {
        barberId: selectedBarberId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: isAllDay ? '00:00' : blockStartTime,
        endTime: isAllDay ? '23:59' : blockEndTime,
        reason: blockReason,
        isAllDay
      };
      const res = await fetch('/api/availability/block', { method: 'POST', body: JSON.stringify(payload) });
      if (res.ok) { alert('Time blocked successfully'); }
      else { alert('Failed to block time'); }
    } catch (e) { console.error(e); alert('Error blocking time'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">Schedule</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Sidebar Controls */}
        <div className="bg-[#1E293B]/50 border border-[#1E293B] rounded-xl p-5 lg:col-span-1 h-fit space-y-5">
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2">Select Barber</label>
            <select 
              className="w-full rounded-lg border border-[#1E293B] bg-[#0F172A] text-[#F8FAFC] p-2.5 text-sm focus:border-[#F5B700] focus:ring-1 focus:ring-[#F5B700] focus:outline-none"
              value={selectedBarberId || ''}
              onChange={(e) => setSelectedBarberId(Number(e.target.value))}
            >
              {barbers.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2">Select Date</label>
            <DateCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />
            <p className="text-center text-xs mt-2 text-[#64748B]">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
            </p>
          </div>
        </div>

        {/* Block Time Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1E293B]/50 border border-[#1E293B] rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-[#F8FAFC]">Block Time</h3>
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Reason</label>
              <Input value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="e.g. Lunch Break" className="bg-[#0F172A] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#475569]" />
            </div>
            
            <label className="flex items-center gap-2 text-sm text-[#94A3B8] cursor-pointer">
              <input 
                type="checkbox" checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)}
                className="rounded border-[#1E293B] bg-[#0F172A] text-[#F5B700] focus:ring-[#F5B700]"
              />
              Block Entire Day
            </label>

            {!isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">Start</label>
                  <input type="time" value={blockStartTime} onChange={(e) => setBlockStartTime(e.target.value)}
                    className="w-full rounded-lg border border-[#1E293B] bg-[#0F172A] text-[#F8FAFC] p-2.5 text-sm focus:border-[#F5B700] focus:ring-1 focus:ring-[#F5B700] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">End</label>
                  <input type="time" value={blockEndTime} onChange={(e) => setBlockEndTime(e.target.value)}
                    className="w-full rounded-lg border border-[#1E293B] bg-[#0F172A] text-[#F8FAFC] p-2.5 text-sm focus:border-[#F5B700] focus:ring-1 focus:ring-[#F5B700] focus:outline-none" />
                </div>
              </div>
            )}
            
            <Button onClick={handleBlockTime} disabled={isSubmitting || !selectedBarberId || !selectedDate} className="w-full sm:w-auto">
              {isSubmitting ? 'Blocking...' : 'Block Time'}
            </Button>
          </div>

          <div className="bg-[#1E293B]/50 border border-[#1E293B] rounded-xl p-5">
            <h3 className="text-base font-bold text-[#F8FAFC] mb-2">Day Overview</h3>
            <p className="text-[#64748B] text-sm">
              Visual timeline of bookings and blocked times will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
