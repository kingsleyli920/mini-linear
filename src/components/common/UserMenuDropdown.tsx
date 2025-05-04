import React, { useState, useRef, useEffect } from 'react';
import { DropdownArrowIcon } from '../icons/IssueIcons';
import { createClient } from '@/lib/supabase/client';

interface UserMenuDropdownProps {
  userName: string;
  userAvatarUrl?: string;
}

const menuItems = [
  { label: 'Settings', shortcut: 'G then S', dummy: true },
  { label: 'Invite and manage members', dummy: true },
  { label: 'Download desktop app', dummy: true },
  { label: 'Switch workspace', shortcut: 'O then W', dummy: true },
  { label: 'Log out', shortcut: '⇧⌘Q', dummy: false },
];

export const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({
  userName,
  userAvatarUrl,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div
      className="user-menu-dropdown"
      ref={menuRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button
        className="flex items-center bg-transparent border-none cursor-pointer px-1 py-0 rounded-md gap-1 user-menu-trigger"
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        <img
          src={userAvatarUrl || '/avatar.svg'}
          alt="avatar"
          className="w-5 h-5 rounded-full mr-1"
        />
        <span className="text-sm font-medium text-[#e2e2e2] max-w-[120px] truncate">
          {userName}
        </span>
        <DropdownArrowIcon className="ml-0.5" />
      </button>
      {open && (
        <div className="user-menu-dropdown-list absolute left-0 mt-2 min-w-[200px] bg-[#232329] rounded-lg shadow-lg py-2 z-50">
          {menuItems.map((item, idx) => (
            <button
              key={item.label}
              onClick={item.dummy ? undefined : handleLogout}
              disabled={item.dummy}
              className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between
                ${item.dummy ? 'text-[#bdbdbd]' : 'text-[#e2e2e2] hover:text-[#e2e2e2] hover:bg-[#23272e]'}
              `}
              style={{ cursor: item.dummy ? 'default' : 'pointer' }}
            >
              <span>{item.label}</span>
              {item.shortcut && (
                <span className="text-[11px] text-[#7c7c8a] ml-3">
                  {item.shortcut}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
