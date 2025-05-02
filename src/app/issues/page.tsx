'use client';

import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/issues/Sidebar';
import IssueList from '@/components/issues/IssueList';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function IssuesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <IssueList />
      </main>
    </div>
  );
}
