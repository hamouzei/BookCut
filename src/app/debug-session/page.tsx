'use client';

import { useSession } from '@/lib/auth/client';
import { Card } from '@/components/ui';
import { useEffect, useState } from 'react';

export default function DebugSessionPage() {
  const { data: session, isPending, error } = useSession();
  const [cookies, setCookies] = useState<string>('');

  useEffect(() => {
    // Get all cookies
    setCookies(document.cookie || 'No cookies found');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Session Debug Info</h1>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <div className="space-y-2">
            <p><strong>Is Pending:</strong> {isPending ? 'Yes' : 'No'}</p>
            <p><strong>Has Error:</strong> {error ? 'Yes' : 'No'}</p>
            {error && <p className="text-red-600"><strong>Error:</strong> {String(error)}</p>}
            <p><strong>Has Session:</strong> {session ? 'Yes ✅' : 'No ❌'}</p>
          </div>
        </Card>

        {session && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Session Data</h2>
            <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(session, null, 2)}
            </pre>
          </Card>
        )}

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Browser Cookies</h2>
          <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm break-all">
            {cookies}
          </pre>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="space-y-2">
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
          </div>
        </Card>

        <Card className="p-6 bg-amber-50 border-amber-200">
          <h2 className="text-xl font-semibold mb-4">What to Check</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>If "Has Session" is No, the session is not being retrieved</li>
            <li>Check if there's a cookie that starts with "better-auth" in Browser Cookies</li>
            <li>If no cookies, the session is not being created at all</li>
            <li>If cookies exist but session is No, there's a cookie retrieval issue</li>
            <li>Make sure you've redeployed with the latest auth configuration</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
