'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  InboxIcon,
  FolderIcon,
  CalendarIcon,
  ChartBarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', icon: HomeIcon },
  { name: 'Inbox', icon: InboxIcon },
  { name: 'Projects', icon: FolderIcon },
  { name: 'Calendar', icon: CalendarIcon },
  { name: 'Reports', icon: ChartBarIcon },
];

export default function Sidebar() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-bold text-white">Mini Linear</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <button
            key={item.name}
            className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <item.icon className="mr-3 h-6 w-6" />
            {item.name}
          </button>
        ))}
      </nav>
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={handleSignOut}
          className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <UserCircleIcon className="mr-3 h-6 w-6" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
