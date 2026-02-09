'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { Service } from '@/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
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
        const res = await fetch('/api/services', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        
        if (data.success) {
            setServices([...services, data.data]);
            setShowForm(false);
            setFormData({ name: '', description: '', duration: 30, price: 0 }); // Reset
        } else {
            alert(data.error || 'Failed to create service');
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
        <h1 className="text-3xl font-bold text-slate-900">Services</h1>
        <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Service'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6 border-amber-200 bg-amber-50/50">
            <h2 className="text-xl font-bold mb-4">Add New Service</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                    <Input 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Buzz Cut"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea 
                        className="w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Brief details..."
                        rows={3}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                        <Input 
                            type="number"
                            required
                            min={15}
                            step={15}
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Price (ETB)</label>
                        <Input 
                            type="number"
                            required
                            min={0}
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Service'}
                    </Button>
                </div>
            </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
            <p className="text-slate-500 col-span-full text-center py-12">Loading services...</p>
        ) : services.map(service => (
            <Card key={service.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                        ${service.price}
                    </span>
                </div>
                <p className="text-slate-600 text-sm mb-4 min-h-[40px]">{service.description}</p>
                <div className="flex items-center text-sm text-slate-500">
                    <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {service.duration} mins
                    </span>
                </div>
            </Card>
        ))}
      </div>
    </div>
  );
}
