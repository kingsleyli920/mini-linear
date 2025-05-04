'use client';

import { AssigneeIcon } from '../../icons/IssueIcons';

interface AssigneeAvatarProps {
  assignee?: {
    name: string;
    avatarUrl?: string;
  } | null;
}

export default function AssigneeAvatar({ assignee }: AssigneeAvatarProps) {
  // 计算用户名缩写 (e.g. John Doe -> JD)
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
  );
}
