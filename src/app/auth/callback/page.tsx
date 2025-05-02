'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/issues');
      } else {
        router.replace('/');
      }
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-lg text-gray-500">
      Signing in, please wait...
    </div>
  );
} 