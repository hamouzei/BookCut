'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { authClient } from '@/lib/auth/client';

export function Header() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      try {
        const { data } = await authClient.getSession();
        if (data?.user) {
          setUser({
            name: data.user.name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email || '',
            role: (data.user as any).role || 'user',
          });
        }
      } catch (e) {
        console.error("Session error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">💈</span>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Book<span className="text-amber-600">Cut</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#services" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
              Services
            </Link>
            <Link href="/#barbers" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
              Barbers
            </Link>
            {user && (
              <Link href="/bookings" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
                My Bookings
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-slate-900 font-bold hover:text-amber-600 transition-colors">
                  Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600 hidden lg:inline-block">
                      Hi, <span className="font-semibold text-slate-900">{user.name}</span>
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                    <Link href="/book">
                      <Button size="sm">Book Now</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link href="/book">
                      <Button size="sm">Book Now</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
