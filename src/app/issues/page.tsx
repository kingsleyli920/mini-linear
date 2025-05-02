'use client';

import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/issues/Sidebar';
import IssueList from '@/components/issues/IssueList';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import MobileHeader from '@/components/common/MobileHeader';

export default function IssuesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useIsDesktop();

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
    <div className="flex h-screen bg-[#f3f4f6]">
      <MobileHeader onMenu={() => setSidebarOpen(true)} />
      {!isDesktop && (
        <Sidebar mobile open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      {isDesktop && <Sidebar className="flex" />}
      <main className="flex-1 min-h-0 h-full pt-16 sm:pt-0 p-4 sm:p-8 overflow-y-auto flex flex-col items-center bg-white">
        <div className="w-full max-w-2xl h-full">
          <IssueList />
        </div>
      </main>
    </div>
  );
}
