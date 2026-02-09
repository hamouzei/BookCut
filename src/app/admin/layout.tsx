'use client';

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Bookings', href: '/admin/bookings' },
    { label: 'Services', href: '/admin/services' },
    { label: 'Barbers', href: '/admin/barbers' },
    { label: 'Schedule', href: '/admin/schedule' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:block flex-shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
          <p className="text-slate-400 text-sm mt-1">Barbershop Booking</p>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-white font-medium'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-800">
           {session?.user && (
           <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold">
                {session.user.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{session.user.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{session.user.role}</p>
              </div>
           </div>
           )}
           <Button 
             variant="outline" 
             className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
             onClick={() => router.push('/')}
           >
             Back to Site
           </Button>
        </div>
      </aside>

      {/* Mobile Nav & Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm border-b p-4 flex items-center justify-between">
          <span className="font-bold text-lg">Admin Panel</span>
          {/* Mobile menu logic could go here, simplified for now */}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
