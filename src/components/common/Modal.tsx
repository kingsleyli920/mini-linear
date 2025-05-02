'use client';
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute left-0 w-full h-full flex items-center justify-center pointer-events-none sm:left-64 sm:w-[calc(100vw-16rem)]">
        <div className="pointer-events-auto border border-white/20 shadow-2xl bg-[#232329] rounded-2xl">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
