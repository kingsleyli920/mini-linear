import React, { useState, useRef, useEffect } from 'react';
import { DropdownArrowIcon } from '../icons/IssueIcons';
import { createClient } from '@/lib/supabase/client';

interface UserMenuDropdownProps {
  userName: string;
  userAvatarUrl?: string;
  mobileView?: boolean;
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
  mobileView = false,
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

  const avatarBg = userName?.[0]?.toUpperCase() || 'K';

  return (
    <div
      className="user-menu-dropdown flex-1 flex items-center gap-1.5"
      ref={menuRef}
      style={{ position: 'relative', display: 'flex' }}
    >
      <button
        className="flex items-center bg-transparent border-none cursor-pointer px-1 py-0 rounded-md gap-1.5 user-menu-trigger w-full"
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        {userAvatarUrl ? (
          <img
            src={userAvatarUrl || '/avatar.svg'}
            alt="avatar"
            className="w-5 h-5 rounded mr-1"
          />
        ) : (
          <div className="w-5 h-5 rounded bg-[#8a6bf6] flex items-center justify-center text-white font-semibold text-base">
            {avatarBg}
          </div>
        )}
        <span className="text-xs font-medium text-[#e2e2e2] max-w-[120px] truncate">
          {userName}
        </span>
        <DropdownArrowIcon className="w-4 h-4 text-[#bdbdbd] ml-0.5" />
      </button>
      {open && (
        <div
          className="user-menu-dropdown-list absolute left-0 mt-2 min-w-[220px] bg-[#232329] rounded-lg shadow-lg py-2 z-[10000]"
          style={{
            top: '100%',
            left: mobileView ? '8px' : '0',
          }}
        >
          {menuItems.map((item, idx) => (
            <button
              key={item.label}
              onClick={item.dummy ? undefined : handleLogout}
              disabled={item.dummy}
              className={`w-full text-left px-4 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-between
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
