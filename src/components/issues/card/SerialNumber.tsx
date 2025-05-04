'use client';

interface SerialNumberProps {
  serial?: string;
}

export default function SerialNumber({ serial }: SerialNumberProps) {
  return (
    <span className="text-xs font-mono text-gray-400 ml-2 mr-2 shrink-0 min-w-[48px]">
      {serial}
    </span>
  );
}
