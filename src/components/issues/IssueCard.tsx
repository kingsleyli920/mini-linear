'use client';

import { useRouter } from 'next/navigation';
import { PriorityIcon } from '../icons/IssueIcons';
import StatusDropdown from './card/StatusDropdown';
import AssigneeAvatar from './card/AssigneeAvatar';
import SerialNumber from './card/SerialNumber';
import IssueTitle from './card/IssueTitle';
import IssueDateDisplay from './card/IssueDateDisplay';

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

  // 处理状态变更
  const handleStatusChange = (newStatus: string) => {
    console.log('IssueCard接收到状态变更:', newStatus, '从:', issue.status);

    // 通知父组件更新状态
    onEdit({
      ...issue,
      status: newStatus,
      updated_at: new Date().toISOString(),
    });

    console.log('已调用父组件onEdit');
  };

  // 处理标题点击
  const handleTitleClick = () => {
    if (onClick && typeof index === 'number' && typeof total === 'number') {
      onClick(issue, index, total);
    } else {
      router.push(`/issues/${issue.id}`);
    }
  };

  return (
    <div className="flex items-center px-4 py-2 group hover:bg-[#23272e] transition-colors border-l-2 border-transparent hover:border-indigo-500 min-h-[44px] relative">
      {/* 优先级图标 */}
      <PriorityIcon priority={priority} />

      {/* 序列号 */}
      <SerialNumber serial={issue.serial} />

      {/* 状态下拉菜单 */}
      <StatusDropdown
        issueId={issue.id}
        status={issue.status}
        onStatusChange={handleStatusChange}
      />

      {/* 标题 */}
      <IssueTitle title={issue.title} onClick={handleTitleClick} />

      {/* 创建日期 */}
      <IssueDateDisplay created_at={issue.created_at} />

      {/* 负责人头像 */}
      <AssigneeAvatar assignee={issue.assignee} />
    </div>
  );
}
