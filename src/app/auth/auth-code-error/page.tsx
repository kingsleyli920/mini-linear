'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const ERROR_MESSAGES: Record<string, string> = {
  no_code: '未收到认证码，请重试登录',
  oauth_error: 'OAuth认证错误',
  exchange_failed: '认证码交换失败',
  session_error: '会话获取失败',
  no_session: '未能创建会话',
  unexpected: '发生意外错误',
};

export default function AuthCodeError() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get('error') || 'unexpected';
  const description = searchParams.get('description');
  const errorMessage = ERROR_MESSAGES[errorType] || '未知错误';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            认证错误
          </h2>
          <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-500">
              错误详情: {description}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">错误类型: {errorType}</p>
        </div>
        <div className="mt-8">
          <Link
            href="/"
            className="flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
