import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import STATUS_OPTIONS from './statusOptions';

interface Issue {
  id: number | string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function IssueCard({
  issue,
  onEdit,
  onDelete,
}: {
  issue: Issue;
  onEdit: (issue: Issue) => void;
  onDelete: (issue: Issue) => void;
}) {
  return (
    <div className="card hover:shadow-lg transition-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono bg-gray-200 text-gray-700 rounded px-2 py-0.5">
            {issue.id}
          </span>
          <h3 className="text-base sm:text-lg font-semibold text-white">
            {issue.title}
          </h3>
        </div>
        <p className="text-gray-400 mt-1 mb-2 break-words">
          {issue.description}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 min-w-[120px]">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            STATUS_OPTIONS.find((s) => s.value === issue.status)?.color
          }`}
        >
          {issue.status}
        </span>
        <span className="text-xs text-gray-500">
          Created: {new Date(issue.created_at).toLocaleDateString()}
        </span>
        <span className="text-xs text-gray-500">
          Updated:{' '}
          {issue.updated_at
            ? new Date(issue.updated_at).toLocaleDateString()
            : '--'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(issue)}
          className="text-gray-500 hover:text-gray-700"
        >
          <PencilSquareIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(issue)}
          className="text-gray-500 hover:text-gray-700"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
