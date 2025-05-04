'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  StatusIcon,
  InProgressIcon,
  DoneIcon,
  CanceledIcon,
  BacklogIcon,
} from '../../icons/IssueIcons';

const STATUS_OPTIONS = [
  { value: 'backlog', label: 'Backlog', icon: <BacklogIcon /> },
  { value: 'todo', label: 'Todo', icon: <StatusIcon /> },
  { value: 'in progress', label: 'In Progress', icon: <InProgressIcon /> },
  { value: 'done', label: 'Done', icon: <DoneIcon /> },
  { value: 'canceled', label: 'Canceled', icon: <CanceledIcon /> },
  { value: 'duplicate', label: 'Duplicate', icon: <CanceledIcon /> },
];

interface StatusDropdownProps {
  issueId: string | number;
  status: string;
  onStatusChange: (newStatus: string) => void;
}

export default function StatusDropdown({
  issueId,
  status,
  onStatusChange,
}: StatusDropdownProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // 根据状态返回对应的图标
  function getStatusIcon() {
    switch (status) {
      case 'in progress':
        return <InProgressIcon />;
      case 'done':
        return <DoneIcon />;
      case 'canceled':
        return <CanceledIcon />;
      case 'backlog':
        return <BacklogIcon />;
      case 'duplicate':
        return <CanceledIcon />;
      default:
        return <StatusIcon />;
    }
  }

  // 直接通过普通DOM操作处理点击
  const setupMenuClickHandlers = () => {
    if (!menuRef.current) return;

    // 为每个菜单项添加原生点击事件
    const menuItems = menuRef.current.querySelectorAll('[data-status]');
    menuItems.forEach((item) => {
      const statusValue = item.getAttribute('data-status');
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('菜单项点击 (DOM):', statusValue);

        if (!statusValue || statusValue === status || updating) return;

        // 直接调用状态更新函数
        updateStatus(statusValue);
      });
    });
  };

  // 更新状态的核心逻辑
  const updateStatus = async (newStatus: string) => {
    console.log('执行状态更新:', newStatus);

    try {
      setUpdating(true);
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('issues')
        .update({ status: newStatus, updated_at: now })
        .eq('id', issueId);

      if (error) {
        console.error('更新状态失败:', error);
        alert('更新状态失败: ' + error.message);
        return;
      }

      // 更新成功，通知父组件
      onStatusChange(newStatus);
      console.log('状态已更新为:', newStatus);
    } catch (err) {
      console.error('处理状态变更时出错:', err);
      alert('更新状态时发生错误');
    } finally {
      setUpdating(false);
      setMenuOpen(false);
    }
  };

  // 设置点击外部关闭菜单
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClick);
      // 设置菜单项点击处理器
      setupMenuClickHandlers();
    } else {
      document.removeEventListener('mousedown', handleClick);
    }

    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <span className="mr-3 shrink-0 relative">
      <button
        ref={buttonRef}
        className="flex items-center justify-center w-7 h-7 rounded hover:bg-[#23272e] transition"
        onClick={() => {
          console.log('点击状态图标，切换菜单');
          setMenuOpen((v) => !v);
        }}
        disabled={updating}
      >
        {getStatusIcon()}
      </button>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 top-8 z-[9999] min-w-[180px] bg-[#232329] border border-[#23272e] rounded-lg shadow-xl py-2 text-[13px]"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="px-4 py-1 text-gray-400 font-medium select-none text-xs">
            Change status...
          </div>

          {/* 使用简单的HTML来避免React事件系统的问题 */}
          {STATUS_OPTIONS.map((item, idx) => (
            <div
              key={item.value}
              data-status={item.value}
              className={`flex items-center w-full px-4 py-1.5 gap-2 text-xs text-left transition rounded-md
                ${status === item.value ? 'bg-[#23272e] text-indigo-400' : 'text-gray-200 hover:bg-[#23272e]'}`}
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              <span className="flex-none">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              <span className="ml-auto text-gray-500 text-[10px]">
                {idx + 1}
              </span>
              {status === item.value && (
                <svg
                  className="w-2.5 h-2.5 ml-1 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </span>
  );
}
