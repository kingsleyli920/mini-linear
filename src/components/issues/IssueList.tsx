'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { DBUser } from '@/services/userService';

interface Issue {
  id: number;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  user: DBUser;
}

export function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchIssues = async () => {
    if (!user) return;

    try {
      // 获取用户的issues
      const { data: issuesData, error: issuesError } = await supabase
        .from('issues')
        .select(
          `
          *,
          user:user_id (
            id,
            full_name,
            avatar_url
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (issuesError) {
        throw issuesError;
      }

      setIssues(issuesData || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIssue = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('issues')
        .insert([
          {
            title: '新问题',
            status: 'todo',
            priority: 'medium',
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 重新获取issues列表
      fetchIssues();
    } catch (error) {
      console.error('Error adding issue:', error);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">问题列表</h1>
            <p className="mt-2 text-sm text-gray-700">
              所有问题的列表，包括它们的标题、状态和优先级。
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={handleAddIssue}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
            >
              添加问题
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      标题
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      状态
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      优先级
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      创建时间
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      创建者
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {issues.map((issue) => (
                    <tr key={issue.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {issue.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {issue.status}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {issue.priority}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(issue.created_at).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          {issue.user?.avatar_url && (
                            <img
                              src={issue.user.avatar_url}
                              alt={issue.user.full_name}
                              className="h-6 w-6 rounded-full mr-2"
                            />
                          )}
                          <span>{issue.user?.full_name}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
