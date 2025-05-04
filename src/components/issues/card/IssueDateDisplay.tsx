'use client';

interface IssueDateDisplayProps {
  created_at: string;
}

export default function IssueDateDisplay({
  created_at,
}: IssueDateDisplayProps) {
  // 格式化日期为 "月 日" 格式
  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <span className="text-xs text-gray-500 ml-4 min-w-[60px] text-right">
      {formattedDate}
    </span>
  );
}
