'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { Barber } from '@/types';

export default function AdminBarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

  const emptyForm = { name: '', email: '', phone: '', bio: '' };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { fetchBarbers(); }, []);

  async function fetchBarbers() {
    try {
      const res = await fetch('/api/barbers');
      const data = await res.json();
      if (data.success) setBarbers(data.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }

  function openEditForm(barber: Barber) {
    setEditingBarber(barber);
    setFormData({ name: barber.name, email: barber.email || '', phone: barber.phone || '', bio: barber.bio || '' });
    setShowForm(true);
  }

  function openNewForm() {
    setEditingBarber(null);
    setFormData(emptyForm);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingBarber) {
        // Update
        const res = await fetch(`/api/barbers/${editingBarber.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          setBarbers(barbers.map(b => b.id === editingBarber.id ? data.data : b));
          setShowForm(false);
          setFormData(emptyForm);
          setEditingBarber(null);
        } else { alert(data.error || 'Failed to update barber'); }
      } else {
        // Create
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, workingHours: defaultWorkingHours })
        });
        const data = await res.json();
        if (data.success) {
          setBarbers([...barbers, data.data]);
          setShowForm(false);
          setFormData(emptyForm);
        } else { alert(data.error || 'Failed to create barber'); }
      }
    } catch (e) { console.error(e); alert('Error submitting form'); }
    finally { setIsSubmitting(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to remove this barber? This action can be undone by re-activating.')) return;
    try {
      const res = await fetch(`/api/barbers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBarbers(barbers.filter(b => b.id !== id));
      } else { alert('Failed to delete barber'); }
    } catch (e) { console.error(e); }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">Barbers / Staff</h1>
        <Button size="sm" onClick={() => showForm ? (setShowForm(false), setEditingBarber(null)) : openNewForm()}>
            {showForm ? '✕ Cancel' : '+ Add Barber'}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-[#1E293B]/60 border border-[#F5B700]/15 rounded-xl p-5">
          <h2 className="text-lg font-bold text-[#F8FAFC] mb-4">{editingBarber ? 'Edit Barber' : 'Add New Barber'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Full Name</label>
                <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. James Cutter" className="bg-[#0F172A] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#475569]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Email</label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="james@example.com" className="bg-[#0F172A] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#475569]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Bio</label>
              <textarea className="w-full rounded-lg border border-[#1E293B] bg-[#0F172A] text-[#F8FAFC] p-3 text-sm focus:border-[#F5B700] focus:ring-1 focus:ring-[#F5B700] focus:outline-none placeholder:text-[#475569]" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Expertise, experience..." rows={2} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Phone</label>
              <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Optional" className="bg-[#0F172A] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#475569]" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditingBarber(null); }} className="text-[#94A3B8]">Cancel</Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingBarber ? 'Save Changes' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Barber Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-[#64748B] col-span-full text-center py-12 text-sm">Loading team...</p>
        ) : barbers.length === 0 ? (
          <p className="text-[#64748B] col-span-full text-center py-12 text-sm">No barbers added yet.</p>
        ) : barbers.map(barber => (
          <div key={barber.id} className="bg-[#1E293B]/50 border border-[#1E293B] rounded-xl p-5 flex flex-col items-center text-center hover:border-[#F5B700]/20 transition-colors">
            <div className="h-16 w-16 rounded-full bg-[#F5B700]/15 mb-3 flex items-center justify-center text-xl font-bold text-[#F5B700] overflow-hidden">
              {barber.avatarUrl ? (
                <img src={barber.avatarUrl} alt={barber.name} className="h-full w-full object-cover" />
              ) : barber.name.charAt(0)}
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC]">{barber.name}</h3>
            <p className="text-xs text-[#64748B] mb-2">{barber.email || 'No email'}</p>
            <p className="text-[#94A3B8] text-xs mb-4 flex-1 line-clamp-2">{barber.bio || 'No bio available.'}</p>
            <div className="w-full flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs border-[#1E293B] text-[#94A3B8] hover:border-[#F5B700]/50 hover:text-[#F5B700]" onClick={() => openEditForm(barber)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(barber.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
