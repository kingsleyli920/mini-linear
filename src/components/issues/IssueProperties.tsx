import { BarChart2, Circle, Sun, Tag, Box } from 'lucide-react';
import IssuePropertiesHeader from './IssuePropertiesHeader';
import { StatusIcon, PriorityIcon, AssigneeIcon } from '../icons/IssueIcons';

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-400';
    case 'low':
      return 'text-green-400';
    default:
      return 'text-gray-400';
  }
}

export default function IssueProperties({ issue }: { issue: any }) {
  const priority = issue.priority || 'medium';
  return (
    <aside className="hidden lg:flex flex-col w-[260px] min-w-[220px] max-w-[320px] bg-transparent px-4 py-6">
      <IssuePropertiesHeader />
      {/* 顶部三项 */}
      <div className="flex flex-col gap-4 mt-2">
        <button className="flex items-center w-full gap-2 px-3 py-2.5 rounded-lg hover:bg-[#18181b] transition text-sm font-medium text-[#bdbdbd] h-10">
          <StatusIcon />
          <span className="ml-2">Todo</span>
        </button>
        <button className="flex items-center w-full gap-2 px-3 py-2.5 rounded-lg hover:bg-[#18181b] transition text-sm font-medium text-[#bdbdbd] h-10">
          <PriorityIcon priority={priority} />
          <span className="ml-2 capitalize">{priority}</span>
        </button>
        <button className="flex items-center w-full gap-2 px-3 py-2.5 rounded-lg hover:bg-[#18181b] transition text-sm font-medium text-[#bdbdbd] h-10">
          <AssigneeIcon />
          <span className="ml-2">Assign</span>
        </button>
      </div>
      {/* Labels 分组 */}
      <div className="mt-6 mb-2 text-[11px] text-[#7c7c8a] font-normal px-1">
        Labels
      </div>
      <button className="flex items-center w-full gap-2 px-3 py-2.5 rounded-lg hover:bg-[#18181b] transition text-sm font-medium text-[#bdbdbd] h-10">
        <Tag className="w-5 h-5 text-[#bdbdbd]" strokeWidth={1.5} />
        <span className="ml-2">Add label</span>
      </button>
      {/* Project 分组 */}
      <div className="mt-6 mb-2 text-[11px] text-[#7c7c8a] font-normal px-1">
        Project
      </div>
      <button className="flex items-center w-full gap-2 px-3 py-2.5 rounded-lg hover:bg-[#18181b] transition text-sm font-medium text-[#bdbdbd] h-10">
        <Box className="w-5 h-5 text-[#bdbdbd]" strokeWidth={1.5} />
        <span className="ml-2">Add to project</span>
      </button>
    </aside>
  );
}
