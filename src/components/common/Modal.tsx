'use client';
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Modal({
  children,
  isOpen = true,
  onClose,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      />
      <div className="absolute left-0 w-full h-full flex items-center justify-center pointer-events-none sm:left-64 sm:w-[calc(100vw-16rem)]">
        <div className="pointer-events-auto w-[calc(100%-24px)] mx-3 sm:w-[50%] sm:max-w-[90%] border border-white/20 shadow-2xl bg-[#232329] rounded-xl">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
