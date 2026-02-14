'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { Service } from '@/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const emptyForm = { name: '', description: '', duration: 30, price: 0 };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { fetchServices(); }, []);

  async function fetchServices() {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }

  function openEditForm(service: Service) {
    setEditingService(service);
    setFormData({ name: service.name, description: service.description || '', duration: service.duration, price: service.price });
    setShowForm(true);
  }

  function openNewForm() {
    setEditingService(null);
    setFormData(emptyForm);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingService) {
        const res = await fetch(`/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          setServices(services.map(s => s.id === editingService.id ? data.data : s));
          setShowForm(false);
          setFormData(emptyForm);
          setEditingService(null);
        } else { alert(data.error || 'Failed to update service'); }
      } else {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          setServices([...services, data.data]);
          setShowForm(false);
          setFormData(emptyForm);
        } else { alert(data.error || 'Failed to create service'); }
      }
    } catch (e) { console.error(e); alert('Error submitting form'); }
    finally { setIsSubmitting(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to remove this service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices(services.filter(s => s.id !== id));
      } else { alert('Failed to delete service'); }
    } catch (e) { console.error(e); }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">Services</h1>
        <Button size="sm" onClick={() => showForm ? (setShowForm(false), setEditingService(null)) : openNewForm()}>
          {showForm ? '✕ Cancel' : '+ Add Service'}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-[#1E293B]/60 border border-[#F5B700]/15 rounded-xl p-5">
          <h2 className="text-lg font-bold text-[#F8FAFC] mb-4">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Service Name</label>
              <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Buzz Cut" className="bg-[#0F172A] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#475569]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Description</label>
              <textarea className="w-full rounded-lg border border-[#1E293B] bg-[#0F172A] text-[#F8FAFC] p-3 text-sm focus:border-[#F5B700] focus:ring-1 focus:ring-[#F5B700] focus:outline-none placeholder:text-[#475569]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Brief details..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Duration (mins)</label>
                <Input type="number" required min={15} step={15} value={formData.duration} onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})} className="bg-[#0F172A] border-[#1E293B] text-[#F8FAFC]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Price (ETB)</label>
                <Input type="number" required min={0} value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})} className="bg-[#0F172A] border-[#1E293B] text-[#F8FAFC]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditingService(null); }} className="text-[#94A3B8]">Cancel</Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingService ? 'Save Changes' : 'Save Service'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-[#64748B] col-span-full text-center py-12 text-sm">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-[#64748B] col-span-full text-center py-12 text-sm">No services added yet.</p>
        ) : services.map(service => (
          <div key={service.id} className="bg-[#1E293B]/50 border border-[#1E293B] rounded-xl p-5 hover:border-[#F5B700]/20 transition-colors flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base font-bold text-[#F8FAFC]">{service.name}</h3>
              <span className="bg-[#F5B700]/15 text-[#F5B700] text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap ml-2">
                ${service.price}
              </span>
            </div>
            <p className="text-[#94A3B8] text-xs mb-3 flex-1 min-h-[32px] line-clamp-2">{service.description}</p>
            <div className="flex items-center text-xs text-[#64748B] mb-3">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {service.duration} mins
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs border-[#1E293B] text-[#94A3B8] hover:border-[#F5B700]/50 hover:text-[#F5B700]" onClick={() => openEditForm(service)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(service.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
