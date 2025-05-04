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
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import React from 'react';
import { DropdownArrowIcon } from '../icons/IssueIcons';
import { UserMenuDropdown } from './UserMenuDropdown';

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

  // 调试头像问题
  console.log('Sidebar user:', user);
  console.log('Sidebar avatar_url:', user?.user_metadata?.avatar_url);

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
            <div className="fixed left-0 top-0 h-full w-64 z-[9999] flex flex-col bg-[#101011] shadow-2xl animate-slide-in">
              {/* 顶部用户信息区 */}
              <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                <UserMenuDropdown
                  userName={user?.user_metadata?.name || user?.email || 'User'}
                  userAvatarUrl={user?.user_metadata?.avatar_url}
                />
                <div className="flex-1" />
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#232329] hover:bg-[#23272e] ml-1">
                  <MagnifyingGlassIcon className="w-5 h-5 text-[#bdbdbd]" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#232329] hover:bg-[#23272e] ml-1">
                  <PencilSquareIcon className="w-5 h-5 text-[#bdbdbd]" />
                </button>
              </div>
              {/* 顶部用户信息（模拟团队名/用户名） */}
              <div className="flex items-center gap-2 px-3 mt-4 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-white font-bold text-sm">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-semibold text-white">
                  {user?.user_metadata?.name || user?.email || 'User'}
                </span>
              </div>
              {/* 分组1 Workspace */}
              <div className="mt-6 mb-2 text-xs font-normal text-[#7c7c8a] px-3">
                Workspace
              </div>
              <nav className="flex flex-col gap-1">
                {navigation.slice(0, 3).map((item) => (
                  <button
                    key={item.name}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition"
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.name}
                  </button>
                ))}
              </nav>
              {/* 分组2 Your teams */}
              <div className="mt-6 mb-2 text-xs font-normal text-[#7c7c8a] px-3">
                Your teams
              </div>
              <nav className="flex flex-col gap-1">
                {navigation.slice(3, 5).map((item) => (
                  <button
                    key={item.name}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition"
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.name}
                  </button>
                ))}
              </nav>
              {/* 分组3 Try */}
              <div className="mt-6 mb-2 text-xs font-normal text-[#7c7c8a] px-3">
                Try
              </div>
              <nav className="flex flex-col gap-1">
                {customMenus.map((item, idx) => (
                  <button
                    key={item + idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition"
                  >
                    <FolderIcon className="w-5 h-5 mr-2" />
                    {item}
                  </button>
                ))}
              </nav>
              {/* 底部 */}
              <div className="mt-auto border-t border-[#23272e] p-4 flex flex-col items-center gap-2 shrink-0">
                {user && (
                  <div className="flex flex-col items-center text-[#bdbdbd] text-xs">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold mb-1">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-semibold text-white">
                      {user.user_metadata?.name || user.email}
                    </span>
                    <span className="text-xs text-[#7c7c8a]">{user.email}</span>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] mt-2"
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
    <div className="hidden sm:flex sm:w-64 w-0 flex-col bg-[#101011] h-full">
      {/* 顶部用户信息区 */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <UserMenuDropdown
          userName={user?.user_metadata?.name || user?.email || 'User'}
          userAvatarUrl={user?.user_metadata?.avatar_url}
        />
        <div className="flex-1" />
        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#232329] hover:bg-[#23272e] ml-1">
          <MagnifyingGlassIcon className="w-5 h-5 text-[#bdbdbd]" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#232329] hover:bg-[#23272e] ml-1">
          <PencilSquareIcon className="w-5 h-5 text-[#bdbdbd]" />
        </button>
      </div>
      {/* 菜单分组和项 */}
      <nav className="flex-1 overflow-y-auto px-0 py-2">
        {/* 第一组 */}
        <div className="flex flex-col gap-0.5 mt-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#e2e2e2] bg-[#23272e]">
            <InboxIcon className="w-4 h-4 mr-2" />
            Inbox
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="#bdbdbd"
              strokeWidth="1.5"
              viewBox="0 0 16 16"
            >
              <rect x="2" y="4" width="12" height="8" rx="2" />
              <path d="M4 8h8" />
            </svg>
            My issues
          </button>
        </div>
        {/* Workspace 分组 */}
        <div className="text-[11px] text-[#7c7c8a] font-normal px-3 mb-1 mt-5">
          Workspace
        </div>
        <div className="flex flex-col gap-0.5">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="#bdbdbd"
              strokeWidth="1.5"
              viewBox="0 0 16 16"
            >
              <rect x="2" y="2" width="12" height="12" rx="3" />
            </svg>
            Projects
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="#bdbdbd"
              strokeWidth="1.5"
              viewBox="0 0 16 16"
            >
              <rect x="2" y="4" width="12" height="8" rx="2" />
              <path d="M4 8h8" />
            </svg>
            Views
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="#bdbdbd"
              strokeWidth="1.5"
              viewBox="0 0 16 16"
            >
              <circle cx="8" cy="8" r="6" />
              <circle cx="8" cy="8" r="2" />
            </svg>
            More
          </button>
        </div>
        {/* Your teams 分组 */}
        <div className="text-[11px] text-[#7c7c8a] font-normal px-3 mb-1 mt-5">
          Your teams
        </div>
        <div className="flex flex-col gap-0.5">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#e2e2e2] bg-[#23272e]">
            <svg className="w-4 h-4 mr-2" fill="#a78bfa" viewBox="0 0 16 16">
              <rect width="16" height="16" rx="8" />
              <path
                fill="#fff"
                d="M8 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0 6c2.338 0 3.6.475 3.972 1.424A.43.43 0 0 1 12 12H4a.43.43 0 0 1-.028-.157C4.399 10.474 5.662 10 8 10Z"
              />
            </svg>
            Kingsley-test
            <DropdownArrowIcon className="w-4 h-4 text-[#bdbdbd] ml-auto" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#e2e2e2] bg-[#23272e] mt-1">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="#bdbdbd"
              strokeWidth="1.5"
              viewBox="0 0 16 16"
            >
              <rect x="2" y="4" width="12" height="8" rx="2" />
              <path d="M4 8h8" />
            </svg>
            Issues
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="#bdbdbd"
              strokeWidth="1.5"
              viewBox="0 0 16 16"
            >
              <rect x="2" y="2" width="12" height="12" rx="3" />
            </svg>
            Projects
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="#bdbdbd"
              strokeWidth="1.5"
              viewBox="0 0 16 16"
            >
              <rect x="2" y="4" width="12" height="8" rx="2" />
              <path d="M4 8h8" />
            </svg>
            Views
          </button>
        </div>
        {/* Try 分组 */}
        <div className="text-[11px] text-[#7c7c8a] font-normal px-3 mb-1 mt-5">
          Try
        </div>
        <div className="flex flex-col gap-0.5">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="#bdbdbd"
              strokeWidth="1.5"
              viewBox="0 0 16 16"
            >
              <rect x="2" y="4" width="12" height="8" rx="2" />
              <path d="M4 8h8" />
            </svg>
            Import issues
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="#bdbdbd"
              strokeWidth="2"
              viewBox="0 0 16 16"
            >
              <path d="M8 2v12M2 8h12" />
            </svg>
            Invite people
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="#bdbdbd"
              strokeWidth="1.5"
              viewBox="0 0 16 16"
            >
              <circle cx="8" cy="8" r="6" />
              <path d="M8 4v4l3 3" />
            </svg>
            Link GitHub
          </button>
        </div>
      </nav>
    </div>
  );
}
