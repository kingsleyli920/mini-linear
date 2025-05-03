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
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import React from 'react';

const navigation = [
  { name: 'Home', icon: HomeIcon },
  { name: 'Inbox', icon: InboxIcon },
  { name: 'Projects', icon: FolderIcon },
  { name: 'Calendar', icon: CalendarIcon },
  { name: 'Reports', icon: ChartBarIcon },
];

export default function Sidebar({
  className = '',
  mobile = false,
  open = false,
  onClose,
}: {
  className?: string;
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();
  const [customMenus, setCustomMenus] = useState<string[]>([]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleAddMenu = () => {
    setCustomMenus((prev) => [...prev, `Custom ${prev.length + 1}`]);
  };

  // 移动端抽屉模式
  if (mobile) {
    return (
      <>
        {open && (
          <>
            <div
              className="fixed inset-0 z-[9998] bg-black bg-opacity-40"
              onClick={onClose}
            ></div>
            <div className="fixed left-0 top-0 h-full w-64 z-[9999] flex flex-col bg-gray-900 shadow-2xl animate-slide-in">
              {/* 头部 */}
              <div className="flex h-16 items-center px-4 shrink-0">
                <h1 className="text-xl font-bold text-white">Mini Linear</h1>
              </div>
              {/* 菜单区 */}
              <nav className="flex-1 overflow-y-auto space-y-1 px-2 py-4">
                {navigation.map((item, idx) => (
                  <React.Fragment key={item.name}>
                    <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                      <item.icon className="mr-3 h-6 w-6" />
                      {item.name}
                    </button>
                    {idx === navigation.length - 1 && (
                      <>
                        {customMenus.map((item, idx) => (
                          <button
                            key={item + idx}
                            className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            <FolderIcon className="mr-3 h-6 w-6" />
                            {item}
                          </button>
                        ))}
                        <button
                          onClick={handleAddMenu}
                          className="w-full bg-indigo-700 text-white rounded px-2 py-1 mb-2 font-semibold"
                        >
                          Add Menu
                        </button>
                        <p className="text-xs text-gray-400 mb-2">
                          Only used to test the scroll bar, no actual function
                        </p>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </nav>
              {/* 底部 */}
              <div className="border-t border-gray-700 p-4 flex flex-col items-center gap-2 shrink-0">
                {user && (
                  <div className="flex flex-col items-center text-gray-300 text-xs">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold mb-1">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-semibold">
                      {user.user_metadata?.name || user.email}
                    </span>
                    <span className="text-gray-500">{user.email}</span>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white mt-2"
                >
                  <UserCircleIcon className="mr-3 h-6 w-6" />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // 桌面端
  return (
    <div
      className={`hidden sm:flex sm:w-64 w-0 flex-col bg-gray-900 ${className} h-full`}
    >
      {/* 顶部标题固定 */}
      <div className="flex h-16 items-center px-4 shrink-0">
        <h1 className="text-xl font-bold text-white">Mini Linear</h1>
      </div>
      {/* 中间菜单区可滚动 */}
      <nav className="flex-1 overflow-y-auto space-y-1 px-2 py-4">
        {navigation.map((item, idx) => (
          <React.Fragment key={item.name}>
            <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
              <item.icon className="mr-3 h-6 w-6" />
              {item.name}
            </button>
            {idx === navigation.length - 1 && (
              <>
                {customMenus.map((item, idx) => (
                  <button
                    key={item + idx}
                    className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <FolderIcon className="mr-3 h-6 w-6" />
                    {item}
                  </button>
                ))}
                <button
                  onClick={handleAddMenu}
                  className="w-full bg-indigo-700 text-white rounded px-2 py-1 mb-2 font-semibold"
                >
                  Add Menu
                </button>
                <p className="text-xs text-gray-400 mb-2">
                  Only used to test the scroll bar, no actual function
                </p>
              </>
            )}
          </React.Fragment>
        ))}
      </nav>
      {/* 底部用户信息和按钮固定 */}
      <div className="mt-auto border-t border-gray-700 p-4 flex flex-col items-center gap-2 shrink-0">
        {user && (
          <div className="flex flex-col items-center text-gray-300 text-xs">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold mb-1">
              {user.email?.[0]?.toUpperCase()}
            </div>
            <span className="font-semibold">
              {user.user_metadata?.name || user.email}
            </span>
            <span className="text-gray-500">{user.email}</span>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white mt-2"
        >
          <UserCircleIcon className="mr-3 h-6 w-6" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
