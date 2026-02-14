'use client';

import { signIn } from '@/lib/auth/client';
import { Button } from '@/components/ui';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#F5B700]/6 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative">
        <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-[#F5B700]/12 rounded-2xl p-8 shadow-2xl shadow-[#0F172A]/50">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#F5B700]/10 rounded-2xl mb-5 border border-[#F5B700]/15">
              <span className="text-3xl">✂️</span>
            </div>
            <h1 className="text-2xl font-bold text-[#F8FAFC]">Welcome to <span className="text-[#F5B700]">BookCut</span></h1>
            <p className="text-[#94A3B8] mt-2 text-sm">
              Sign in to book your appointment
            </p>
          </div>

          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 font-bold"
            size="lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <div className="mt-8 pt-6 border-t border-[#1E293B] text-center">
            <p className="text-xs text-[#64748B]">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
