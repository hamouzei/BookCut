/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth/client';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    todayBookings: 0,
    upcomingBookings: 0,
    pendingBookings: 0,
    activeBarbers: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/bookings?limit=100&status=confirmed');
        if (res.ok) {
            const data = await res.json();
            const today = new Date().toISOString().split('T')[0];
            const bookings: any[] = data.data || [];
            
            setStats({
                todayBookings: bookings.filter((b: any) => b.date === today).length,
                upcomingBookings: bookings.filter((b: any) => b.date >= today).length,
                pendingBookings: 0,
                activeBarbers: 2
            });
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">Dashboard</h1>
        <p className="text-[#94A3B8] mt-1 text-sm">Welcome back, {session?.user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard title="Today" value={stats.todayBookings.toString()} icon="📅" trend="+2 from yesterday" />
        <StatsCard title="Upcoming" value={stats.upcomingBookings.toString()} icon="📈" trend="Next 7 days" />
        <StatsCard title="Pending" value={stats.pendingBookings.toString()} icon="⏳" />
        <StatsCard title="Barbers" value={stats.activeBarbers.toString()} icon="✂️" trend="Fully staffed" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Bookings */}
        <div className="bg-[#1E293B]/50 border border-[#1E293B] rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-[#F8FAFC]">Recent Bookings</h3>
            <Link href="/admin/bookings" className="text-xs text-[#F5B700] hover:text-[#FFC933]">View All →</Link>
          </div>
          <p className="text-[#64748B] text-sm">No recent bookings to display.</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#1E293B]/50 border border-[#1E293B] rounded-xl p-5">
          <h3 className="text-base font-bold text-[#F8FAFC] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/admin/bookings?new=true', icon: '➕', label: 'New Booking' },
              { href: '/admin/schedule', icon: '🛑', label: 'Block Time' },
              { href: '/admin/services', icon: '📋', label: 'Services' },
              { href: '/admin/barbers', icon: '👥', label: 'Team' },
            ].map((action) => (
              <Link 
                key={action.href}
                href={action.href} 
                className="p-3 border border-[#1E293B] rounded-lg hover:border-[#F5B700]/30 hover:bg-[#F5B700]/5 flex flex-col items-center gap-1.5 transition-all group"
              >
                <span className="text-xl">{action.icon}</span>
                <span className="text-xs font-medium text-[#94A3B8] group-hover:text-[#F5B700]">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend }: { title: string, value: string, icon: string, trend?: string }) {
    return (
        <div className="bg-[#1E293B]/50 border border-[#1E293B] rounded-xl p-4 sm:p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">{title}</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-[#F8FAFC]">{value}</h3>
                </div>
                <div className="h-9 w-9 bg-[#F5B700]/10 rounded-lg flex items-center justify-center text-lg">
                    {icon}
                </div>
            </div>
            {trend && <p className="text-xs text-[#64748B] mt-3">{trend}</p>}
        </div>
    );
}
