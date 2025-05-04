'use client';

import Modal from '@/components/common/Modal';
import STATUS_OPTIONS from './statusOptions';
import { useState, useEffect, useRef } from 'react';
import {
  BarChart2,
  Circle,
  UserCircle2,
  MoreHorizontal,
  Paperclip,
  User,
  ChevronRight,
} from 'lucide-react';
import { Switch } from '@headlessui/react';

interface IssueModalProps {
  open: boolean;
  initialTitle?: string;
  initialDescription?: string;
  initialStatus?: string;
  loading?: boolean;
  onSave: (title: string, description: string, status: string) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const STATUS_DROPDOWN = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: <Circle className="w-4 h-4 text-gray-400" />,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: <Circle className="w-4 h-4 text-gray-400" />,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: <Circle className="w-4 h-4 text-yellow-400" fill="#facc15" />,
  },
  {
    value: 'done',
    label: 'Done',
    icon: <Circle className="w-4 h-4 text-indigo-400" fill="#6366f1" />,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: <Circle className="w-4 h-4 text-gray-500" fill="#6b7280" />,
  },
  {
    value: 'duplicate',
    label: 'Duplicate',
    icon: <Circle className="w-4 h-4 text-gray-500" fill="#6b7280" />,
  },
];

export default function IssueModal({
  open,
  initialTitle = '',
  initialDescription = '',
  initialStatus = 'todo',
  loading = false,
  onSave,
  onCancel,
  isEdit = false,
}: IssueModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState(initialStatus);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const statusBtnRef = useRef<HTMLButtonElement>(null);
  const [createMore, setCreateMore] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setStatus(initialStatus);
      setStatusDropdown(false);
    }
  }, [open, initialTitle, initialDescription, initialStatus]);

  // 关闭下拉菜单（点击外部）
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        statusBtnRef.current &&
        !statusBtnRef.current.contains(e.target as Node)
      ) {
        setStatusDropdown(false);
      }
    }
    if (statusDropdown) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [statusDropdown]);

  if (!open) return null;
  // 顶部标签内容
  const projectName = 'KIN'; // TODO: 动态获取
  return (
    <Modal>
      <div className="bg-[#232329] rounded-xl shadow-xl border-2 border-[#23272e] outline outline-1 outline-[#23272e] w-[700px] max-w-[90vw] min-h-[220px] mx-auto p-0">
        {/* 顶部 serial 和标题 */}
        <div className="flex items-center px-7 pt-5 pb-2 border-b border-[#23272e]">
          <span className="flex items-center text-xs font-mono bg-[#23272e] rounded px-2 py-1 mr-2 gap-1">
            <User className="w-3.5 h-3.5 text-pink-400" fill="#f472b6" />
            <span className="font-mono font-bold tracking-widest text-gray-200">
              {projectName}
            </span>
            <ChevronRight className="w-3 h-3 text-gray-500 mx-1" />
          </span>
          <span className="text-gray-300 text-sm font-semibold">New issue</span>
          {/* 最大化按钮+Tooltip */}
          <div className="relative group ml-auto">
            <button
              className="p-1 text-gray-500 hover:text-gray-300"
              title="Expand"
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 18 18"
              >
                <rect x="3" y="3" width="12" height="12" rx="2" />
              </svg>
            </button>
            <div className="absolute right-0 top-8 z-50 hidden group-hover:flex flex-col items-start bg-[#23272e] text-xs text-gray-200 rounded shadow px-3 py-2 gap-1 min-w-[120px] border border-[#23272e]">
              <span>Expand</span>
              <span className="flex items-center gap-1 text-gray-400">
                <kbd className="px-1 py-0.5 bg-[#232329] rounded border border-gray-600 text-xs">
                  Ctrl
                </kbd>
                <kbd className="px-1 py-0.5 bg-[#232329] rounded border border-gray-600 text-xs">
                  Shift
                </kbd>
                <kbd className="px-1 py-0.5 bg-[#232329] rounded border border-gray-600 text-xs">
                  F
                </kbd>
              </span>
            </div>
          </div>
          <button
            className="ml-2 p-1 text-gray-500 hover:text-gray-300"
            onClick={onCancel}
            title="Close"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 18 18"
            >
              <line x1="14" y1="4" x2="4" y2="14" />
              <line x1="4" y1="4" x2="14" y2="14" />
            </svg>
          </button>
        </div>
        {/* 内容区 */}
        <div className="px-7 pt-6 pb-2">
          <input
            className="w-full bg-transparent text-sm font-semibold text-gray-200 placeholder-gray-500 outline-none border-none mb-2 leading-tight"
            placeholder="Issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            style={{ letterSpacing: '-0.5px' }}
          />
          <textarea
            className="w-full bg-transparent text-xs text-gray-400 placeholder-gray-500 outline-none border-none resize-none mb-3 min-h-[28px] leading-snug"
            placeholder="Add description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          {/* 横向按钮区 */}
          <div className="flex items-center gap-1.5 mb-2 relative">
            {/* Status 按钮（可下拉） */}
            <button
              ref={statusBtnRef}
              className={`flex items-center gap-1 px-2 py-0.5 rounded bg-[#23272e] text-[11px] font-medium border border-[#23272e] hover:border-indigo-500 transition h-6 min-w-[70px] ${statusDropdown ? 'border-indigo-500' : ''}`}
              onClick={() => setStatusDropdown((v) => !v)}
              type="button"
            >
              {STATUS_DROPDOWN.find((s) => s.value === status)?.icon}
              <span
                className={
                  status === 'in progress'
                    ? 'text-yellow-400'
                    : status === 'done'
                      ? 'text-indigo-400'
                      : status === 'canceled' || status === 'duplicate'
                        ? 'text-gray-500'
                        : 'text-gray-200'
                }
              >
                {STATUS_DROPDOWN.find((s) => s.value === status)?.label ||
                  'Status'}
              </span>
              <svg
                className="w-2.5 h-2.5 ml-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Status 下拉菜单 */}
            {statusDropdown && (
              <div
                className="fixed z-50 min-w-[160px] max-h-60 overflow-y-auto bg-[#232329] border border-[#23272e] rounded-md shadow-xl py-1 text-[11px]"
                style={{
                  left: statusBtnRef.current?.getBoundingClientRect().left,
                  top:
                    (statusBtnRef.current?.getBoundingClientRect().bottom ||
                      0) + 4,
                }}
              >
                <div className="px-3 py-1 text-gray-400 font-medium select-none text-[11px]">
                  Change status...
                </div>
                {STATUS_DROPDOWN.map((item, idx) => (
                  <button
                    key={item.value}
                    className={`flex items-center w-full px-3 py-1 gap-2 text-[11px] text-left transition
                      ${status === item.value ? 'bg-[#23272e] text-indigo-400' : 'text-gray-200 hover:bg-[#23272e]'}
                      ${idx === 0 ? 'rounded-t-md' : ''} ${idx === STATUS_DROPDOWN.length - 1 ? 'rounded-b-md' : ''}`}
                    onClick={() => {
                      setStatus(item.value);
                      setStatusDropdown(false);
                    }}
                    type="button"
                  >
                    {item.icon}
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
                  </button>
                ))}
              </div>
            )}
            {/* Priority 按钮（静态） */}
            <button className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#23272e] text-gray-400 text-xs font-medium border border-[#23272e] h-6 min-w-[60px]">
              <BarChart2 className="w-3 h-3" />
              Priority
            </button>
            {/* Assignee 按钮（静态） */}
            <button className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#23272e] text-gray-400 text-xs font-medium border border-[#23272e] h-6 min-w-[70px]">
              <UserCircle2 className="w-3 h-3" />
              Assignee
            </button>
            {/* 附件/更多按钮（静态） */}
            <button className="flex items-center justify-center w-6 h-6 rounded bg-[#23272e] text-gray-400 border border-[#23272e]">
              <Paperclip className="w-3 h-3" />
            </button>
            <button className="flex items-center justify-center w-6 h-6 rounded bg-[#23272e] text-gray-400 border border-[#23272e]">
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>
        </div>
        {/* 底部操作区 */}
        <div className="flex items-center justify-between px-7 h-12 border-t border-[#23272e] bg-[#232329]">
          <div className="flex items-center gap-2 text-gray-500">
            <Paperclip className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={createMore}
              onChange={setCreateMore}
              className={`${createMore ? 'bg-indigo-600' : 'bg-gray-700'} relative inline-flex h-4 w-8 items-center rounded-full transition`}
            >
              <span className="sr-only">Create more</span>
              <span
                className={`${createMore ? 'translate-x-4' : 'translate-x-1'} inline-block h-2.5 w-2.5 transform rounded-full bg-white transition`}
              />
            </Switch>
            <span className="text-[11px] text-gray-400 select-none">
              Create more
            </span>
            <button
              onClick={() => onSave(title, description, status)}
              className="px-4 py-1.5 rounded bg-indigo-600 text-white font-semibold text-[11px] shadow hover:bg-indigo-700 transition"
              disabled={loading || !title.trim() || !description.trim()}
            >
              {loading ? 'Creating...' : 'Create issue'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
