import { Link, Badge, GitBranch } from 'lucide-react';

export default function IssuePropertiesHeader() {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <span className="text-xs text-gray-500 font-medium">Properties</span>
      <div className="flex items-center gap-2">
        <button
          className="p-1 rounded hover:bg-[#23272e] text-gray-400"
          title="Copy link"
        >
          <Link className="w-4 h-4" />
        </button>
        <button
          className="p-1 rounded hover:bg-[#23272e] text-gray-400"
          title="Copy ID"
        >
          <Badge className="w-4 h-4" />
        </button>
        <button
          className="p-1 rounded hover:bg-[#23272e] text-gray-400"
          title="Branch actions"
        >
          <GitBranch className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
