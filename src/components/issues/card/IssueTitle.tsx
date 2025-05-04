'use client';

interface IssueTitleProps {
  title: string;
  onClick: () => void;
}

export default function IssueTitle({ title, onClick }: IssueTitleProps) {
  return (
    <span
      className="flex-1 flex items-center gap-2 text-xs text-gray-100 truncate"
      onClick={onClick}
    >
      {title}
    </span>
  );
}
