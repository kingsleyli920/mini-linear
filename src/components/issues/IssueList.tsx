'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Modal from '@/components/common/Modal';
import { useAuth } from '@/contexts/AuthContext';

interface Issue {
  id: number | string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

export default function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchIssues() {
      try {
        // 获取当前用户
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIssues([]);
          setLoading(false);
          return;
        }
        // 只查当前用户的 issues
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching issues:', error);
          return;
        }

        setIssues(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);

  // 生成自定义 issue id
  const generateIssueId = () => {
    if (!user) return '';
    const prefix = (user.user_metadata?.name || user.email || 'USR').slice(0, 3).toUpperCase();
    // 找到当前用户已有的最大编号
    let maxNum = 0;
    issues.forEach(issue => {
      if (typeof issue.id === 'string' && issue.id.startsWith(prefix + '-')) {
        const match = Number(issue.id.split('-')[1]);
        if (match > maxNum) maxNum = match;
      }
    });
    return `${prefix}-${maxNum + 1}`;
  };

  const handleAddIssue = async () => {
    if (!newTitle.trim()) return;
    setAdding(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('No user found, please login again.');
      setAdding(false);
      return;
    }
    // 生成自定义 issue id
    const customId = generateIssueId();
    const { data, error } = await supabase
      .from('issues')
      .insert([{ id: customId, title: newTitle, description: newDescription, status: 'todo', user_id: user.id }])
      .select('*')
      .single();
    setAdding(false);
    if (error) {
      alert('Failed to add issue: ' + error.message);
      return;
    }
    setIssues((prev) => [data, ...prev]);
    setShowModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* 顶部标题和按钮固定 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0 w-full mt-4 sm:mt-6 shrink-0">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">Issues</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          Add Issue
        </button>
      </div>
      {/* 下方 issues 列表可滚动 */}
      <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-4 w-full sm:pr-2">
        {loading ? (
          <div>Loading issues...</div>
        ) : issues.length === 0 ? (
          <div className="card max-w-sm mx-auto text-center py-6 text-gray-400 text-base">No issues found.</div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue.id}
              className="card hover:shadow-lg transition-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono bg-gray-200 text-gray-700 rounded px-2 py-0.5">{issue.id}</span>
                  <h3 className="text-base sm:text-lg font-semibold text-white">{issue.title}</h3>
                </div>
                <p className="text-gray-400 mt-1 mb-2 break-words">{issue.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2 min-w-[120px]">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{issue.status}</span>
                <span className="text-xs text-gray-500">{new Date(issue.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Modal 保持原样 */}
      {showModal && (
        <Modal>
          <div className="modal-content card">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Add New Issue</h3>
            <input
              className="input"
              placeholder="Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              disabled={adding}
            />
            <textarea
              className="input"
              placeholder="Description"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              disabled={adding}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
                disabled={adding}
              >
                Cancel
              </button>
              <button
                onClick={handleAddIssue}
                className="btn-primary"
                disabled={adding || !newTitle.trim()}
              >
                {adding ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
