import { User, ChevronRight, Star, MoreHorizontal } from 'lucide-react';

export default function IssueDetailHeaderLeft({ issue }: { issue: any }) {
  return (
    <span className="flex items-center gap-2 text-xs text-gray-400 font-mono mr-4">
      <User className="w-4 h-4 text-purple-400" />
      Kingsley-test
      <ChevronRight className="w-3 h-3 text-gray-500 mx-1" />
      <span className="text-gray-300 font-semibold">{issue.serial}</span>
      <button className="p-1 rounded hover:bg-[#23272e] text-gray-400">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      <button className="ml-2 p-1 rounded hover:bg-[#23272e] text-gray-400">
        <Star className="w-4 h-4" />
      </button>
    </span>
  );
}
