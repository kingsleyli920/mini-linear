'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import IssueCard from './IssueCard';
import IssueModal from './IssueModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { v4 as uuidv4 } from 'uuid';

interface Issue {
  id: number | string;
  serial?: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [deletingIssue, setDeletingIssue] = useState<Issue | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('todo');
  const [editLoading, setEditLoading] = useState(false);
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchIssues() {
      try {
        // 获取当前用户
        const {
          data: { user },
        } = await supabase.auth.getUser();
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

  // 生成用户前缀-序号编号
  const generateSerial = () => {
    if (!user) return '';
    const prefix = (user.user_metadata?.name || user.email || 'USR')
      .slice(0, 3)
      .toUpperCase();
    let maxNum = 0;
    issues.forEach((issue) => {
      if (
        typeof issue.serial === 'string' &&
        issue.serial.startsWith(prefix + '-')
      ) {
        const match = Number(issue.serial.split('-')[1]);
        if (match > maxNum) maxNum = match;
      }
    });
    return `${prefix}-${maxNum + 1}`;
  };

  const handleAddIssue = async () => {
    if (!newTitle.trim()) return;
    setAdding(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert('No user found, please login again.');
      setAdding(false);
      return;
    }
    // 生成 uuid 作为主键 id
    const uuid = uuidv4();
    // 生成 serial 字段
    const serial = generateSerial();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('issues')
      .insert([
        {
          id: uuid,
          serial,
          title: newTitle,
          description: newDescription,
          status: 'todo',
          user_id: user.id,
          updated_at: now,
        },
      ])
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

  const openEditModal = (issue: Issue) => {
    setEditingIssue(issue);
    setEditTitle(issue.title);
    setEditDescription(issue.description);
    setEditStatus(issue.status);
  };

  const handleEditSave = async (
    title: string,
    description: string,
    status: string
  ) => {
    if (!editingIssue) return;
    setEditLoading(true);
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('issues')
      .update({
        title,
        description,
        status,
        updated_at: now,
      })
      .eq('id', editingIssue.id);
    setEditLoading(false);
    if (!error) {
      setIssues((prev) =>
        prev.map((i) =>
          i.id === editingIssue.id
            ? {
                ...i,
                title,
                description,
                status,
                updated_at: now,
              }
            : i
        )
      );
      setEditingIssue(null);
    } else {
      alert('Failed to update issue: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!deletingIssue) return;
    const { error } = await supabase
      .from('issues')
      .delete()
      .eq('id', deletingIssue.id);
    if (!error) {
      setIssues((prev) => prev.filter((i) => i.id !== deletingIssue.id));
      setDeletingIssue(null);
    } else {
      alert('Failed to delete issue: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* 顶部标题和按钮固定 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0 w-full mt-4 sm:mt-6 shrink-0">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
          Issues
        </h2>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          Add Issue
        </button>
      </div>
      {/* 下方 issues 列表可滚动 */}
      <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-4 w-full sm:pr-2">
        {loading ? (
          <div>Loading issues...</div>
        ) : issues.length === 0 ? (
          <div className="card max-w-sm mx-auto text-center py-6 text-gray-400 text-base">
            No issues found.
          </div>
        ) : (
          issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onEdit={openEditModal}
              onDelete={setDeletingIssue}
            />
          ))
        )}
      </div>
      <IssueModal
        open={!!(showModal || editingIssue)}
        initialTitle={editingIssue ? editTitle : newTitle}
        initialDescription={editingIssue ? editDescription : newDescription}
        initialStatus={editingIssue ? editStatus : 'todo'}
        loading={adding || editLoading}
        onSave={(title, description, status) => {
          if (editingIssue) {
            handleEditSave(title, description, status);
          } else {
            setNewTitle(title);
            setNewDescription(description);
            handleAddIssue();
          }
        }}
        onCancel={() => {
          setShowModal(false);
          setEditingIssue(null);
        }}
        isEdit={!!editingIssue}
      />
      <ConfirmDeleteModal
        open={!!deletingIssue}
        loading={false}
        onConfirm={handleDelete}
        onCancel={() => setDeletingIssue(null)}
      />
    </div>
  );
}
