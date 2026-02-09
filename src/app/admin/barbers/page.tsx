'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { Barber } from '@/types';

export default function AdminBarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    fetchBarbers();
  }, []);

  async function fetchBarbers() {
    try {
      const res = await fetch('/api/barbers');
      const data = await res.json();
      if (data.success) {
        setBarbers(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        // Default working hours (Mon-Fri 9-6, Sat 10-4)
        const defaultWorkingHours = {
            monday: { start: '09:00', end: '18:00', isWorking: true },
            tuesday: { start: '09:00', end: '18:00', isWorking: true },
            wednesday: { start: '09:00', end: '18:00', isWorking: true },
            thursday: { start: '09:00', end: '18:00', isWorking: true },
            friday: { start: '09:00', end: '18:00', isWorking: true },
            saturday: { start: '10:00', end: '16:00', isWorking: true },
            sunday: { start: '00:00', end: '00:00', isWorking: false }
        };

        const res = await fetch('/api/barbers', {
            method: 'POST',
            body: JSON.stringify({ ...formData, workingHours: defaultWorkingHours })
        });
        const data = await res.json();
        
        if (data.success) {
            setBarbers([...barbers, data.data]);
            setShowForm(false);
            setFormData({ name: '', email: '', phone: '', bio: '' }); // Reset
        } else {
            alert(data.error || 'Failed to create barber');
        }
    } catch (e) {
        console.error(e);
        alert('Error submitting form');
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Barbers / Staff</h1>
        <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Barber'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6 border-amber-200 bg-amber-50/50">
            <h2 className="text-xl font-bold mb-4">Add New Barber</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <Input 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. James Cutter"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <Input 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="james@example.com"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                    <textarea 
                        className="w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Expertise, experience..."
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                     <Input 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="Optional contact number"
                    />
                </div>
                
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Create Profile'}
                    </Button>
                </div>
            </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
            <p className="text-slate-500 col-span-full text-center py-12">Loading team...</p>
        ) : barbers.map(barber => (
            <Card key={barber.id} className="p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-slate-200 mb-4 flex items-center justify-center text-2xl font-bold text-slate-500 overflow-hidden">
                    {barber.avatarUrl ? (
                        <img src={barber.avatarUrl} alt={barber.name} className="h-full w-full object-cover" />
                    ) : (
                        barber.name.charAt(0)
                    )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{barber.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{barber.email || 'No email'}</p>
                
                <p className="text-slate-600 text-sm mb-6 flex-1">{barber.bio || 'No bio available.'}</p>
                
                <div className="w-full flex gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                        Edit Profile
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                        Schedule
                    </Button>
                </div>
            </Card>
        ))}
      </div>
    </div>
  );
}
