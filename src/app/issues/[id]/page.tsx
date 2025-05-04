'use client';
import { useParams, useSearchParams } from 'next/navigation';
import {
  BarChart2,
  Star,
  MoreHorizontal,
  ChevronLeft,
  User,
  Circle,
  ChevronRight,
} from 'lucide-react';
import Sidebar from '@/components/common/Sidebar';
import IssueProperties from '@/components/issues/IssueProperties';
import IssueDetailHeaderLeft from '@/components/issues/IssueDetailHeaderLeft';
import IssueDetailHeaderRight from '@/components/issues/IssueDetailHeaderRight';

export default function IssueDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const issueId = params?.id;
  // TODO: 后续接入真实数据
  const issue = {
    serial: 'KIN-3',
    title: 'Connect to Slack',
    description: `If your team uses Slack, enable this integration to keep your workflow and communication in sync.\n\n- See issue updates in a dedicated channel.\n- Use the /linear command to create new issues from Slack messages.\n- Sync comments between Slack and Linear.\n- Set up personal Slack notifications.\n- Import custom emoji 🥳 to your Linear workspace.\n\n[Connect Slack →](#)`,
    status: 'todo',
    created_at: '2024-05-02T00:00:00Z',
    assignee: { name: 'Linear', avatarUrl: '' },
    priority: 'medium',
  };

  return (
    <div className="flex h-screen w-full bg-[#101011] text-gray-100">
      {/* 左侧 Sidebar */}
      <Sidebar className="hidden md:flex" />
      {/* 中间主内容+右侧属性栏 */}
      <main className="flex-1 flex flex-row min-h-0 h-full">
        {/* 主内容区 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 顶部导航栏（面包屑+编号+右侧操作+计数/箭头） */}
          <div className="flex items-center px-8 py-4 border-b border-[#18181b] bg-[#101011] sticky top-0 z-20">
            <IssueDetailHeaderLeft issue={issue} />
            {/* <div className="ml-auto">
              <IssueDetailHeaderRight
                currentIndex={currentIndex}
                total={total}
                onPrev={() => {}}
                onNext={() => {}}
              />
            </div> */}
          </div>
          {/* 主内容区 */}
          <div className="max-w-3xl mx-auto py-8 px-6">
            {/* 标题和描述 */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-gray-100">
                  {issue.title}
                </span>
              </div>
              <div className="prose prose-invert text-gray-300 max-w-none whitespace-pre-line">
                {issue.description}
              </div>
            </div>
            {/* 子任务/附件/更多操作区（可后续补充） */}
            <div className="mb-8">
              <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400">
                <Circle className="w-4 h-4" />
                Add sub-issues
              </button>
            </div>
            {/* 活动流/评论区 */}
            <div className="mt-8 border-t border-[#18181b] pt-6">
              <div className="mb-4 text-xs text-gray-400">Activity</div>
              <div className="flex items-center gap-2 mb-2">
                <Circle className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">
                  Linear created the issue · 22h ago
                </span>
              </div>
              <div className="mt-6">
                <input
                  className="w-full bg-[#232329] rounded-lg border border-[#23272e] px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  placeholder="Leave a comment..."
                />
              </div>
            </div>
          </div>
        </div>
        {/* 右侧属性栏 */}
        <IssueProperties issue={issue} />
      </main>
    </div>
  );
}
