'use client';

import { BarChart2, Circle, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  StatusIcon,
  InProgressIcon,
  DoneIcon,
  CanceledIcon,
  PriorityIcon,
  AssigneeIcon,
  BacklogIcon,
} from '../icons/IssueIcons';

interface Issue {
  id: number | string;
  serial?: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  priority?: string;
  assignee?: {
    name: string;
    avatarUrl?: string;
  };
}

export default function IssueCard({
  issue,
  onEdit,
  onDelete,
  onClick,
  index,
  total,
}: {
  issue: Issue;
  onEdit: (issue: Issue) => void;
  onDelete: (issue: Issue) => void;
  onClick?: (issue: Issue, index: number, total: number) => void;
  index?: number;
  total?: number;
}) {
  const router = useRouter();
  const priority = issue.priority || 'small';
  const assignee = issue.assignee || null;
  const assigneeName = assignee?.name || '';
  const assigneeInitials = assigneeName
    ? assigneeName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';
  return (
    <div className="flex items-center px-4 py-2 group hover:bg-[#23272e] transition-colors border-l-2 border-transparent hover:border-indigo-500 min-h-[44px] relative">
      {/* 信号icon */}
      <PriorityIcon priority={priority} />
      {/* serial */}
      <span className="text-xs font-mono text-gray-400 mr-3 shrink-0 min-w-[48px]">
        {issue.serial}
      </span>
      {/* 状态圆圈 */}
      <span className={`mr-3 shrink-0`}>
        {issue.status === 'in progress' ? (
          <InProgressIcon />
        ) : issue.status === 'done' ? (
          <DoneIcon />
        ) : issue.status === 'canceled' ? (
          <CanceledIcon />
        ) : issue.status === 'backlog' ? (
          <BacklogIcon />
        ) : issue.status === 'duplicate' ? (
          <CanceledIcon />
        ) : (
          <StatusIcon />
        )}
      </span>
      {/* 标题+优先级（只在这里包裹点击事件） */}
      <span
        className="flex-1 flex items-center gap-2 text-xs text-gray-100 truncate cursor-pointer"
        onClick={() => {
          if (
            onClick &&
            typeof index === 'number' &&
            typeof total === 'number'
          ) {
            onClick(issue, index, total);
          } else {
            router.push(`/issues/${issue.id}`);
          }
        }}
      >
        {issue.title}
      </span>
      {/* 右侧日期（不跳转） */}
      <span className="text-xs text-gray-500 ml-4 min-w-[60px] text-right">
        {issue.created_at
          ? new Date(issue.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          : ''}
      </span>
      {/* assignee 头像/缩写/无头像时用 AssigneeIcon */}
      <span className="ml-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 group-hover:shadow-lg transition-shadow">
        {assignee && assignee.avatarUrl ? (
          <img
            src={assignee.avatarUrl}
            alt={assigneeName}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : assigneeInitials ? (
          <span className="text-xs font-bold text-gray-200">
            {assigneeInitials}
          </span>
        ) : (
          <AssigneeIcon />
        )}
      </span>
    </div>
  );
}
