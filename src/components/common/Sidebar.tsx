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

  // 获取用户名首字母作为头像默认显示
  const getUserInitial = (name?: string) => {
    if (!name) return 'U';
    return name.trim()[0]?.toUpperCase() || 'U';
  };

  const userInitial = getUserInitial(
    user?.user_metadata?.name || 'kingsley-test'
  );

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

  // 渲染主侧边栏内容
  const renderSidebarContent = () => (
    <>
      {/* 顶部用户信息区 - 桌面模式下使用UserMenuDropdown组件 */}

      <div className="flex items-center gap-2 px-3 pt-3 pb-2 w-full">
        <UserMenuDropdown
          userName={user?.user_metadata?.name || 'kingsley-test'}
          userAvatarUrl={user?.user_metadata?.avatar_url}
        />
        <div className="flex-1" />
        <button className="w-5 h-5 flex items-center justify-center rounded-full bg-[#232329] hover:bg-[#23272e] ml-1">
          <MagnifyingGlassIcon className="w-5 h-5 text-[#bdbdbd]" />
        </button>
        <button className="w-5 h-5 flex items-center justify-center rounded-full bg-[#232329] hover:bg-[#23272e] ml-1">
          <PencilSquareIcon className="w-5 h-5 text-[#bdbdbd]" />
        </button>
      </div>

      {/* 菜单分组和项 */}
      <nav className="flex-1 overflow-y-auto px-0 py-2">
        {/* 第一组 - 无标题组 */}
        <div className="flex flex-col gap-0.5 mt-2 px-3">
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-5 h-5 text-[#bdbdbd]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 12H2M2 12L10 4M2 12L10 20" />
            </svg>
            Inbox
          </button>
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-5 h-5 text-[#bdbdbd]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            My issues
          </button>
        </div>

        {/* Workspace 分组 */}
        <div className="mt-7 mb-1 px-3">
          <div className="flex items-center text-[12px] text-[#7c7c8a] font-medium">
            Workspace
            <svg
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 px-3">
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-5 h-5 text-[#bdbdbd]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            Projects
          </button>
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-5 h-5 text-[#bdbdbd]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
            </svg>
            Views
          </button>
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-5 h-5 text-[#bdbdbd]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            More
          </button>
        </div>

        {/* Your teams 分组 */}
        <div className="mt-7 mb-1 px-3">
          <div className="flex items-center text-[12px] text-[#7c7c8a] font-medium">
            Your teams
            <svg
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 px-3">
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-[#e2e2e2] hover:bg-[#23272e] transition">
            <div className="w-5 h-5 rounded bg-[#8a6bf6] flex items-center justify-center text-white text-xs">
              {userInitial}
            </div>
            <span>{user?.user_metadata?.name || 'Test'}</span>
            <DropdownArrowIcon className="w-3.5 h-3.5 text-[#bdbdbd] ml-auto" />
            <svg
              className="w-5 h-5 text-[#7c7c8a]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-white bg-[#23272e] transition ml-5">
            <svg
              className="w-5 h-5 text-[#bdbdbd]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
            </svg>
            Issues
          </button>
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition ml-5">
            <svg
              className="w-5 h-5 text-[#bdbdbd]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            Projects
          </button>
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition ml-5">
            <svg
              className="w-5 h-5 text-[#bdbdbd]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
            </svg>
            Views
          </button>
        </div>

        {/* Try 分组 */}
        <div className="mt-7 mb-1 px-3">
          <div className="flex items-center text-[12px] text-[#7c7c8a] font-medium">
            Try
            <svg
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 px-3">
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-5 h-5 text-[#bdbdbd]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
            </svg>
            Import issues
          </button>
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-5 h-5 text-[#bdbdbd]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Invite people
          </button>
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-5 h-5 text-[#bdbdbd]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Cycles
          </button>
          <button className="flex items-center gap-2 py-1.5 rounded-md text-sm font-medium text-[#bdbdbd] hover:text-[#e2e2e2] hover:bg-[#23272e] transition">
            <svg
              className="w-5 h-5 text-[#bdbdbd]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            Link GitHub
          </button>
        </div>
      </nav>
    </>
  );

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
            <div className="fixed left-0 top-0 h-full w-64 z-[9999] flex flex-col bg-[#101011] shadow-2xl">
              <div className="pt-3 pb-1 px-3 border-b border-[#23272e] flex items-center gap-2 w-full">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user?.user_metadata?.name || 'User'}
                    className="w-5 h-5 rounded bg-[#8a6bf6]"
                    onError={(e) => {
                      const imgElement = e.currentTarget as HTMLImageElement;
                      imgElement.style.display = 'none';

                      // 使用下一个兄弟元素（就是我们的默认头像div）
                      const nextElement =
                        imgElement.nextElementSibling as HTMLDivElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div
                  className="w-5 h-5 rounded bg-[#8a6bf6] flex items-center justify-center text-white font-semibold text-xs"
                  style={{
                    display: user?.user_metadata?.avatar_url ? 'none' : 'flex',
                  }}
                >
                  {userInitial}
                </div>
                <span className="text-xs font-medium text-[#e2e2e2]">
                  {user?.user_metadata?.name || 'kingsley-test'}
                </span>
                <div className="flex-1" />
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#232329] hover:bg-[#23272e]">
                  <MagnifyingGlassIcon className="w-4 h-4 text-[#bdbdbd]" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#232329] hover:bg-[#23272e]">
                  <PencilSquareIcon className="w-4 h-4 text-[#bdbdbd]" />
                </button>
              </div>
              {renderSidebarContent()}
            </div>
          </>
        )}
      </>
    );
  }

  // 桌面端
  return (
    <div className="hidden sm:flex sm:w-64 w-0 flex-col bg-[#101011] h-full">
      {renderSidebarContent()}
    </div>
  );
}
