'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { DateCalendar } from '@/components/booking/DateCalendar'; // Reusing Calendar
import { format } from 'date-fns';
import { Barber } from '@/types';

export default function AdminSchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for creating a block
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

        const res = await fetch('/api/availability/block', { // We need to create this route!
            method: 'POST',
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            alert('Time blocked successfully');
            // Reset form or refresh view
        } else {
            alert('Failed to block time');
        }
    } catch (e) {
        console.error(e);
        alert('Error blocking time');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar: Controls */}
      <Card className="p-6 lg:col-span-1 h-fit">
        <h2 className="text-xl font-bold mb-4">Manage Schedule</h2>
        
        {/* Barber Select */}
        <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Barber</label>
            <select 
                className="w-full rounded-md border border-slate-300 p-2"
                value={selectedBarberId || ''}
                onChange={(e) => setSelectedBarberId(Number(e.target.value))}
            >
                {barbers.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                ))}
            </select>
        </div>

        {/* Date Select */}
        <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
            <div className="border rounded-md p-2 bg-slate-50 flex justify-center">
                 <DateCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />
            </div>
            <p className="text-center text-sm mt-2 text-slate-500">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
            </p>
        </div>
      </Card>

      {/* Main Content: Day View & Actions */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Block Time</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                    <Input 
                        value={blockReason} 
                        onChange={(e) => setBlockReason(e.target.value)} 
                        placeholder="e.g. Lunch Break, Meeting"
                    />
                </div>
                
                <div className="flex items-center gap-4">
                     <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input 
                            type="checkbox" 
                            checked={isAllDay} 
                            onChange={(e) => setIsAllDay(e.target.checked)}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        Block Entire Day
                     </label>
                </div>

                {!isAllDay && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                            <input 
                                type="time" 
                                value={blockStartTime}
                                onChange={(e) => setBlockStartTime(e.target.value)}
                                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                            <input 
                                type="time" 
                                value={blockEndTime}
                                onChange={(e) => setBlockEndTime(e.target.value)}
                                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>
                )}
                
                <div className="pt-2">
                    <Button onClick={handleBlockTime} disabled={isSubmitting || !selectedBarberId || !selectedDate}>
                        {isSubmitting ? 'Blocking...' : 'Block Time'}
                    </Button>
                </div>
            </div>
        </Card>

        <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Day Overview</h3>
            <p className="text-slate-500 text-sm">
                Visual timeline of bookings and blocked times will appear here.
                (Placeholder for Phase 6 detailed view)
            </p>
        </Card>
      </div>
    </div>
  );
}
