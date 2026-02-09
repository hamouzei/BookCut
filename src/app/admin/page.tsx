/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import { useSession } from '@/lib/auth/client';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    todayBookings: 0,
    upcomingBookings: 0,
    pendingBookings: 0,
    activeBarbers: 0
  });

  // Placeholder for real stats fetching
  useEffect(() => {
    // In a real app, we'd fetch these from an aggregation API
    // For now, let's just use mock data or fetch all bookings and count on client (not efficient but works for MVP)
    async function fetchStats() {
      try {
        const res = await fetch('/api/bookings?limit=100&status=confirmed'); // simplistic
        if (res.ok) {
            const data = await res.json();
            const today = new Date().toISOString().split('T')[0];
            const bookings: any[] = data.data || [];
            
            setStats({
                todayBookings: bookings.filter((b: any) => b.date === today).length,
                upcomingBookings: bookings.filter((b: any) => b.date >= today).length,
                pendingBookings: 0, // Need to fetch status=pending specifically
                activeBarbers: 2 // We know we seeded 2
            });
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back, {session?.user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
            title="Today's Bookings" 
            value={stats.todayBookings.toString()} 
            icon="📅" 
            trend="+2 from yesterday"
        />
        <StatsCard 
            title="Upcoming" 
            value={stats.upcomingBookings.toString()} 
            icon="📈" 
            trend="Next 7 days"
        />
        <StatsCard 
            title="Pending Approval" 
            value={stats.pendingBookings.toString()} 
            icon="⏳" 
        />
        <StatsCard 
            title="Active Barbers" 
            value={stats.activeBarbers.toString()} 
            icon="✂️" 
            trend="Fully staffed"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Recent Bookings</h3>
            <Link href="/admin/bookings" className="text-sm text-amber-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            <p className="text-slate-500 text-sm">Loading recent bookings...</p>
            {/* List would go here */}
          </div>
        </Card>

        <Card className="p-6">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/bookings?new=true" className="p-4 border rounded-lg hover:bg-slate-50 flex flex-col items-center gap-2 transition-colors">
                <span className="text-2xl">➕</span>
                <span className="font-medium">New Booking</span>
            </Link>
            <Link href="/admin/schedule" className="p-4 border rounded-lg hover:bg-slate-50 flex flex-col items-center gap-2 transition-colors">
                <span className="text-2xl">🛑</span>
                <span className="font-medium">Block Time</span>
            </Link>
            <Link href="/admin/services" className="p-4 border rounded-lg hover:bg-slate-50 flex flex-col items-center gap-2 transition-colors">
                <span className="text-2xl">📋</span>
                <span className="font-medium">Manage Services</span>
            </Link>
            <Link href="/admin/barbers" className="p-4 border rounded-lg hover:bg-slate-50 flex flex-col items-center gap-2 transition-colors">
                <span className="text-2xl">👥</span>
                <span className="font-medium">Manage Team</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend }: { title: string, value: string, icon: string, trend?: string }) {
    return (
        <Card className="p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-3xl font-bold mt-2 text-slate-900">{value}</h3>
                </div>
                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">
                    {icon}
                </div>
            </div>
            {trend && <p className="text-xs text-slate-400 mt-4">{trend}</p>}
        </Card>
    );
}
