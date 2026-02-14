'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth/client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: sessionData, isPending } = useSession();
  const session = sessionData as typeof sessionData & { user: { role: string } } | null;
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push('/login?redirect=' + pathname);
      } else if (session.user.role !== 'admin' && session.user.role !== 'barber') {
        router.push('/');
      }
    }
  }, [session, isPending, router, pathname]);

  const isAuthorized = !isPending && session && (session.user.role === 'admin' || session.user.role === 'barber');

  if (isPending || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5B700]"></div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Bookings', href: '/admin/bookings', icon: '📅' },
    { label: 'Services', href: '/admin/services', icon: '✂️' },
    { label: 'Barbers', href: '/admin/barbers', icon: '👥' },
    { label: 'Schedule', href: '/admin/schedule', icon: '🗓️' },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0B0F1E] border-r border-[#1E293B] 
        transform transition-transform duration-200 ease-in-out flex-shrink-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-5 border-b border-[#1E293B]">
          <Link href="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
            <span className="text-xl font-bold text-[#F8FAFC]">Book<span className="text-[#F5B700]">Cut</span></span>
          </Link>
          <p className="text-[#64748B] text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive
                    ? 'bg-[#F5B700]/10 text-[#F5B700] font-semibold border border-[#F5B700]/20'
                    : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#1E293B]">
           {session?.user && (
           <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-[#F5B700]/15 flex items-center justify-center text-xs font-bold text-[#F5B700]">
                {session.user.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-[#F8FAFC] truncate">{session.user.name}</p>
                <p className="text-xs text-[#64748B] truncate capitalize">{session.user.role}</p>
              </div>
           </div>
           )}
           <Button 
             variant="outline" 
             size="sm"
             className="w-full border-[#1E293B] text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]"
             onClick={() => router.push('/')}
           >
             ← Back to Site
           </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#0B0F1E] border-b border-[#1E293B] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F5B700] hover:bg-[#1E293B] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-[#F8FAFC] text-sm">Book<span className="text-[#F5B700]">Cut</span> Admin</span>
          <div className="w-9" /> {/* Spacer for centering */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
