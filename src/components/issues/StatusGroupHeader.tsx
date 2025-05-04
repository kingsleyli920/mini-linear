'use client';

import React from 'react';
import {
  InProgressIcon,
  StatusIcon,
  BacklogIcon,
  DoneIcon,
  CanceledIcon,
  PlusIcon,
} from '../icons/IssueIcons';

interface StatusGroupHeaderProps {
  status: string;
  label: string;
  count: number;
  onAddClick: () => void;
}

export default function StatusGroupHeader({
  status,
  label,
  count,
  onAddClick,
}: StatusGroupHeaderProps) {
  // 根据状态返回对应的图标
  const getStatusIcon = () => {
    switch (status) {
      case 'in progress':
        return <InProgressIcon className="w-4 h-4 mr-1 align-middle" />;
      case 'backlog':
        return <BacklogIcon className="w-4 h-4" />;
      case 'done':
        return <DoneIcon className="w-4 h-4" />;
      case 'canceled':
        return <CanceledIcon className="w-4 h-4" />;
      case 'duplicate':
        return <CanceledIcon className="w-4 h-4" />;
      default:
        return <StatusIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center px-4 py-2 bg-[#18181b] sticky top-0 z-10">
      <span className="text-gray-200 font-semibold text-sm flex-1 tracking-tight flex items-center gap-2">
        {getStatusIcon()}
        {label}
        <span className="ml-2 text-[11px] text-gray-500 font-normal">
          {count}
        </span>
      </span>
      <button
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#18181b] text-gray-400 hover:text-indigo-400 transition"
        onClick={onAddClick}
        title={`Add to ${label}`}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
