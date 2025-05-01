'use client';

import { Sidebar } from '@/components/issues/Sidebar';
import { IssueList } from '@/components/issues/IssueList';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function IssuesPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <IssueList />
        </div>
      </main>
    </div>
  );
}
