import { ChevronUp, ChevronDown } from 'lucide-react';

export default function IssueDetailHeaderRight({
  currentIndex,
  total,
  onPrev,
  onNext,
}: {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
      <span className="px-2 select-none">
        {currentIndex + 1}/{total}
      </span>
      <button
        className="p-1 rounded hover:bg-[#23272e] disabled:opacity-50"
        onClick={onPrev}
        disabled={currentIndex === 0}
        aria-label="上一个"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        className="p-1 rounded hover:bg-[#23272e] disabled:opacity-50"
        onClick={onNext}
        disabled={currentIndex === total - 1}
        aria-label="下一个"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
