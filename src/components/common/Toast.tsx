'use client';

import React, { useEffect, useState } from 'react';
import {
  DoneIcon,
  CanceledIcon,
  LinkIcon,
  AssigneeIcon,
} from '../icons/IssueIcons';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  issueId?: string;
  issueTitle?: string;
  serial?: string;
  onClose: () => void;
  autoHideDuration?: number;
}

export default function Toast({
  type,
  message,
  issueId,
  issueTitle,
  serial,
  onClose,
  autoHideDuration = 5000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // 等待渐变动画完成后再移除
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [autoHideDuration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <DoneIcon />;
      case 'error':
        return <CanceledIcon />;
      case 'warning':
        return <CanceledIcon />;
      default:
        return <DoneIcon />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-[#1e1e24]';
      case 'error':
        return 'bg-[#2d2023]';
      case 'warning':
        return 'bg-[#2d2421]';
      default:
        return 'bg-[#1e1e24]';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div
        className={`flex flex-col ${getBgColor()} border border-[#33333a] rounded-lg shadow-lg overflow-hidden max-w-sm`}
      >
        <div className="flex items-center p-3">
          <div className={`mr-2 ${getIconColor()}`}>{getIcon()}</div>
          <div className="text-gray-200 text-sm font-medium">{message}</div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="ml-auto text-gray-400 hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        {issueId && issueTitle && (
          <div className="flex items-center border-t border-[#33333a] px-3 py-2 bg-[#18181b]">
            <div className="flex items-center text-sm text-gray-400">
              <div className="w-5 h-5 mr-3 flex items-center justify-center rounded-full border border-[#33333a]">
                {serial ? (
                  <span className="text-xs">{serial.split('-')[0]}</span>
                ) : (
                  <AssigneeIcon className="w-3 h-3" />
                )}
              </div>
              {serial && <span className="mr-2 text-gray-500">{serial}</span>}
              <span className="text-gray-300">{issueTitle}</span>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => {
                  window.location.href = `/issues/${issueId}`;
                }}
                className="text-indigo-400 hover:text-indigo-300 flex items-center text-xs"
              >
                <span className="mr-1">View issue</span>
                <LinkIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 全局Toast管理组件
interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  issueId?: string;
  issueTitle?: string;
  serial?: string;
}

interface ToastContainerProps {
  autoHideDuration?: number;
}

export function ToastContainer({
  autoHideDuration = 5000,
}: ToastContainerProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 添加新的Toast消息
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  };

  // 删除Toast消息
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // 挂载到window上，使其可以在任何组件中使用
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).toast = {
        success: (
          message: string,
          options?: { issueId?: string; issueTitle?: string; serial?: string }
        ) => addToast({ type: 'success', message, ...options }),
        error: (
          message: string,
          options?: { issueId?: string; issueTitle?: string; serial?: string }
        ) => addToast({ type: 'error', message, ...options }),
        warning: (
          message: string,
          options?: { issueId?: string; issueTitle?: string; serial?: string }
        ) => addToast({ type: 'warning', message, ...options }),
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).toast;
      }
    };
  }, []);

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          issueId={toast.issueId}
          issueTitle={toast.issueTitle}
          serial={toast.serial}
          onClose={() => removeToast(toast.id)}
          autoHideDuration={autoHideDuration}
        />
      ))}
    </>
  );
}
