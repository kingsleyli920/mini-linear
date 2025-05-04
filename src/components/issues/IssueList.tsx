'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import IssueCard from './IssueCard';
import IssueModal from './IssueModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { MOCK_ISSUES } from './constants';
import {
  FilterIcon,
  AddViewIcon,
  AllIssuesIcon,
  ActiveIcon,
  BacklogIcon,
  DisplayIcon,
  NotificationIcon,
  LayoutIcon,
  PlusIcon,
  InProgressIcon,
  StatusIcon,
  DoneIcon,
  CanceledIcon,
} from '../icons/IssueIcons';

interface Issue {
  id: number | string;
  serial?: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const STATUS_GROUPS = [
  { key: 'in progress', label: 'In Progress' },
  { key: 'todo', label: 'Todo' },
  { key: 'backlog', label: 'Backlog' },
  { key: 'done', label: 'Done' },
  { key: 'canceled', label: 'Canceled' },
  { key: 'duplicate', label: 'Duplicate' },
];

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
  const [addStatus, setAddStatus] = useState<string>('todo');
  const supabase = createClient();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchIssues() {
      try {
        // 获取当前用户
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setIssues(MOCK_ISSUES); // 没有用户时用 mock 数据
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
          setIssues(MOCK_ISSUES); // 查询出错时也用 mock 数据
          return;
        }

        setIssues(data && data.length > 0 ? data : MOCK_ISSUES); // 没有数据时用 mock
      } catch (error) {
        console.error('Error:', error);
        setIssues(MOCK_ISSUES);
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
          status: addStatus,
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

  // 计算全局 issues 索引映射（优先用 issues，否则用 MOCK_ISSUES）
  const globalList = issues && issues.length > 0 ? issues : MOCK_ISSUES;
  const globalIssueIdList = globalList.map((issue) => issue.id);

  // 分组渲染
  const renderGroupedIssues = () => {
    // 先处理 todo 分组，永远显示
    const todoGroup = STATUS_GROUPS[0];
    const todoIssues = issues.filter((issue) => issue.status === todoGroup.key);
    const otherGroups = STATUS_GROUPS.slice(1);
    return (
      <>
        {/* Todo 分组永远显示 */}
        <div className="mb-2">
          <div className="flex items-center px-4 py-2 bg-[#18181b] sticky top-0 z-10">
            <span className="text-gray-200 font-semibold text-sm flex-1 tracking-tight flex items-center gap-2">
              {todoGroup.key === 'in progress' ? (
                <InProgressIcon className="w-4 h-4 mr-1 align-middle" />
              ) : (
                <StatusIcon className="w-4 h-4" />
              )}
              {todoGroup.label}
              <span className="ml-2 text-[11px] text-gray-500 font-normal">
                {todoIssues.length}
              </span>
            </span>
            <button
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#18181b] text-gray-400 hover:text-indigo-400 transition"
              onClick={() => {
                setAddStatus(todoGroup.key);
                setShowModal(true);
              }}
              title={`Add to ${todoGroup.label}`}
            >
              <PlusIcon />
            </button>
          </div>
          <div className="bg-[#101011] pl-6">
            {todoIssues.length === 0 ? (
              <div className="text-xs text-gray-500 px-6 py-6">No issues</div>
            ) : (
              todoIssues.map((issue) => {
                const globalIndex = globalIssueIdList.findIndex(
                  (id) => id === issue.id
                );
                return (
                  <div key={issue.id}>
                    <IssueCard
                      issue={issue}
                      onEdit={openEditModal}
                      onDelete={setDeletingIssue}
                      index={globalIndex}
                      total={globalList.length}
                      onClick={(issue, index, total) => {
                        router.push(
                          `/issues/${issue.id}?index=${index}&total=${total}`
                        );
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* 其他分组只有有 issue 时才显示 */}
        {otherGroups.map((group, idx) => {
          const groupIssues = issues.filter(
            (issue) => issue.status === group.key
          );
          if (groupIssues.length === 0) return null;
          return (
            <div
              key={group.key}
              className={idx !== otherGroups.length - 1 ? 'mb-2' : ''}
            >
              <div className="flex items-center px-4 py-2 bg-[#18181b] sticky top-0 z-10">
                <span className="text-gray-200 font-semibold text-sm flex-1 tracking-tight flex items-center gap-2">
                  {group.key === 'in progress' && (
                    <InProgressIcon className="w-4 h-4 mr-1 align-middle" />
                  )}
                  {group.key === 'todo' && <StatusIcon className="w-4 h-4" />}
                  {group.key === 'backlog' && (
                    <BacklogIcon className="w-4 h-4" />
                  )}
                  {group.key === 'done' && <DoneIcon className="w-4 h-4" />}
                  {group.key === 'canceled' && (
                    <CanceledIcon className="w-4 h-4" />
                  )}
                  {group.key === 'duplicate' && (
                    <CanceledIcon className="w-4 h-4" />
                  )}
                  {group.label}
                  <span className="ml-2 text-[11px] text-gray-500 font-normal">
                    {groupIssues.length}
                  </span>
                </span>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#18181b] text-gray-400 hover:text-indigo-400 transition"
                  onClick={() => {
                    setAddStatus(group.key);
                    setShowModal(true);
                  }}
                  title={`Add to ${group.label}`}
                >
                  <PlusIcon />
                </button>
              </div>
              <div className="bg-[#101011] pl-6">
                {groupIssues.map((issue) => {
                  const globalIndex = globalIssueIdList.findIndex(
                    (id) => id === issue.id
                  );
                  return (
                    <div key={issue.id}>
                      <IssueCard
                        issue={issue}
                        onEdit={openEditModal}
                        onDelete={setDeletingIssue}
                        index={globalIndex}
                        total={globalList.length}
                        onClick={(issue, index, total) => {
                          router.push(
                            `/issues/${issue.id}?index=${index}&total=${total}`
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#101011] border border-[#23272e] rounded-xl">
      {/* 顶部 header 区域 */}
      <div className="flex items-center px-4 py-2 border-b border-[#23272e] sticky top-0 z-20 bg-[#101011]">
        {/* 选项卡区域 */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium text-[#e2e2e2] bg-[#18181b] border border-[#23272e] focus:outline-none">
            <AllIssuesIcon className="w-4 h-4" />
            All issues
          </button>
          <button className="flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium text-[#bdbdbd] border border-[#23272e] bg-transparent hover:bg-[#18181b]">
            <ActiveIcon className="w-4 h-4" />
            Active
          </button>
          <button className="flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium text-[#bdbdbd] border border-[#23272e] bg-transparent hover:bg-[#18181b]">
            <BacklogIcon className="w-4 h-4" />
            Backlog
          </button>
          <button className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#23272e] bg-transparent hover:bg-[#18181b] ml-2">
            <AddViewIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1" />
        {/* 右侧按钮 */}
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#23272e] bg-transparent hover:bg-[#18181b] mr-2">
          <NotificationIcon className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#23272e] bg-transparent hover:bg-[#18181b]">
          <LayoutIcon className="w-4 h-4" />
        </button>
      </div>
      {/* Filter/Display 区域 */}
      <div className="flex items-center px-4 py-2 border-b border-[#23272e] bg-[#101011]">
        <span className="flex items-center text-gray-400 text-sm font-medium mr-4">
          <FilterIcon className="w-4 h-4 mr-1" />
          Filter
        </span>
        <div className="flex-1" />
        <button className="flex items-center gap-2 px-3 h-8 rounded-lg text-sm font-medium text-[#bdbdbd] border border-[#23272e] bg-transparent hover:bg-[#18181b]">
          <DisplayIcon className="w-4 h-4" />
          Display
        </button>
      </div>
      {/* 分组渲染 */}
      <div className="flex-1 overflow-y-auto pb-4">{renderGroupedIssues()}</div>
      <IssueModal
        open={!!(showModal || editingIssue)}
        initialTitle={editingIssue ? editTitle : newTitle}
        initialDescription={editingIssue ? editDescription : newDescription}
        initialStatus={editingIssue ? editStatus : addStatus}
        loading={adding || editLoading}
        onSave={(title, description, status) => {
          if (editingIssue) {
            handleEditSave(title, description, status);
          } else {
            setNewTitle(title);
            setNewDescription(description);
            setEditStatus(addStatus); // 新增，确保新建时 status 正确
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
