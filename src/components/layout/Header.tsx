'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { authClient } from '@/lib/auth/client';

export function Header() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setMobileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B132B]/80 backdrop-blur-xl border-b border-[#3FFFD9]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group" onClick={closeMobileMenu}>
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-md flex-shrink-0">
                <img 
                  src="/image.svg" 
                  alt="BookCut Logo" 
                  className="h-full w-full object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight">
                Book<span className="text-[#3FFFD9]">Cut</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#services" className="text-[#8B9DC3] hover:text-[#3FFFD9] font-medium transition-colors text-sm">
              Services
            </Link>
            <Link href="/#barbers" className="text-[#8B9DC3] hover:text-[#3FFFD9] font-medium transition-colors text-sm">
              Barbers
            </Link>
            {user && (
              <Link href="/bookings" className="text-[#8B9DC3] hover:text-[#3FFFD9] font-medium transition-colors text-sm">
                My Bookings
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-[#3FFFD9] font-semibold hover:text-[#5BFFD9] transition-colors text-sm">
                  Admin
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-[#8B9DC3] hidden lg:inline-block">
                      <span className="font-medium text-[#F8FAFC]">{user.name}</span>
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[#8B9DC3] hover:text-[#F8FAFC]">
                      Logout
                    </Button>
                    <Link href="/book">
                      <Button size="sm">Book Now</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm" className="text-[#8B9DC3] hover:text-[#F8FAFC]">Login</Button>
                    </Link>
                    <Link href="/book">
                      <Button size="sm">Book Now</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#8B9DC3] hover:text-[#3FFFD9] hover:bg-[#1C2541] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#1C2541]">
            <nav className="flex flex-col space-y-1">
              <Link 
                href="/#services" 
                className="text-[#8B9DC3] hover:text-[#3FFFD9] font-medium transition-colors px-3 py-2.5 rounded-lg hover:bg-[#1C2541]"
                onClick={closeMobileMenu}
              >
                Services
              </Link>
              <Link 
                href="/#barbers" 
                className="text-[#8B9DC3] hover:text-[#3FFFD9] font-medium transition-colors px-3 py-2.5 rounded-lg hover:bg-[#1C2541]"
                onClick={closeMobileMenu}
              >
                Barbers
              </Link>
              {user && (
                <Link 
                  href="/bookings" 
                  className="text-[#8B9DC3] hover:text-[#3FFFD9] font-medium transition-colors px-3 py-2.5 rounded-lg hover:bg-[#1C2541]"
                  onClick={closeMobileMenu}
                >
                  My Bookings
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="text-[#3FFFD9] font-semibold hover:text-[#5BFFD9] transition-colors px-3 py-2.5 rounded-lg hover:bg-[#1C2541]"
                  onClick={closeMobileMenu}
                >
                  Admin
                </Link>
              )}
              
              {!loading && (
                <div className="pt-3 mt-2 border-t border-[#1C2541] space-y-2">
                  {user ? (
                    <>
                      <div className="px-3 py-1.5 text-sm text-[#8B9DC3]">
                        Signed in as <span className="font-semibold text-[#F8FAFC]">{user.name}</span>
                      </div>
                      <Link href="/book" onClick={closeMobileMenu}>
                        <Button size="sm" className="w-full">Book Now</Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={handleLogout} className="w-full mt-2">
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/book" onClick={closeMobileMenu}>
                        <Button size="sm" className="w-full">Book Now</Button>
                      </Link>
                      <Link href="/login" onClick={closeMobileMenu}>
                        <Button variant="outline" size="sm" className="w-full mt-2">Login</Button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
