'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import IssueCard from './IssueCard';
import IssueModal from './IssueModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import StatusGroupHeader from './StatusGroupHeader';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
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
import { IssueListLoading } from '../common/LoadingIndicator';

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
    async function fetchIssuesAndPrefill() {
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
        // 查询当前用户的 issues
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Error fetching issues:', error);
          setIssues([]);
          setLoading(false);
          return;
        }
        // 如果没有数据，自动插入 10 条 mock issues
        if (!data || data.length === 0) {
          const priorities = ['high', 'medium', 'low'];
          const now = new Date().toISOString();
          const prefix = (user.user_metadata?.name || user.email || 'USR')
            .slice(0, 3)
            .toUpperCase();
          const mockIssues = Array.from({ length: 10 }).map((_, i) => ({
            id: uuidv4(),
            serial: `${prefix}-${i + 1}`,
            title:
              [
                'Welcome to Mini Linear!',
                'Connect your GitHub account',
                'Invite your teammates',
                'Try changing issue status',
                'Try changing issue priority',
                'Explore the workspace',
                'Create your first project',
                'Try the search function',
                'Check out the reports',
                'Enjoy productivity!',
              ][i] || `Mock Issue Title ${i + 1}`,
            description: '',
            status: STATUS_GROUPS[i % STATUS_GROUPS.length].key,
            priority: priorities[i % priorities.length],
            user_id: user.id,
            created_at: now,
            updated_at: now,
          }));
          const { error: insertError } = await supabase
            .from('issues')
            .insert(mockIssues);
          if (insertError) {
            console.error('Error inserting mock issues:', insertError);
            setIssues([]);
            setLoading(false);
            return;
          }
          // 再次查询插入后的数据
          const { data: newData } = await supabase
            .from('issues')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          setIssues(newData || []);
          setLoading(false);
          return;
        }
        setIssues(data);
      } catch (error) {
        console.error('Error:', error);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    }
    fetchIssuesAndPrefill();
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

  const handleCreateIssue = async (
    title: string,
    description: string,
    status: string
  ) => {
    if (!title.trim()) return;

    // 关闭模态框
    setShowModal(false);

    // 准备新 issue 数据
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      // 通知用户需要登录
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast.error('请先登录再创建问题');
      }
      return;
    }

    // 生成临时ID和其他数据
    const tempId = uuidv4();
    const serial = generateSerial();
    const now = new Date().toISOString();

    // 创建临时issue对象，用于乐观UI更新
    const tempIssue = {
      id: tempId,
      serial,
      title,
      description: description || '',
      status,
      priority: 'low',
      user_id: user.id,
      created_at: now,
      updated_at: now,
    };

    // 乐观UI更新 - 立即添加到列表
    setIssues((prev) => [tempIssue, ...prev]);

    // 开始实际的API调用
    setAdding(true);

    try {
      // 调用API创建issue
      const { data, error } = await supabase
        .from('issues')
        .insert([
          {
            id: tempId, // 使用相同的ID以便更新
            serial,
            title: tempIssue.title,
            description: tempIssue.description,
            status: tempIssue.status,
            priority: 'low',
            user_id: user.id,
            updated_at: now,
          },
        ])
        .select('*')
        .single();

      if (error) {
        // 创建失败，从列表中移除临时issue
        setIssues((prev) => prev.filter((i) => i.id !== tempId));

        // 显示错误通知
        if (typeof window !== 'undefined' && (window as any).toast) {
          (window as any).toast.error(`创建问题失败: ${error.message}`);
        }

        console.error('Failed to add issue:', error);
        return;
      }

      // 创建成功，更新issue (通常服务器会添加额外字段)
      setIssues((prev) => prev.map((i) => (i.id === tempId ? data : i)));

      // 显示成功通知
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast.success('Issue created', {
          issueId: data.id.toString(),
          issueTitle: data.title,
          serial: data.serial,
        });
      }
    } catch (err) {
      // 处理意外错误
      console.error('Error creating issue:', err);

      // 从列表中移除临时issue
      setIssues((prev) => prev.filter((i) => i.id !== tempId));

      // 显示错误通知
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast.error('创建问题时发生错误');
      }
    } finally {
      setAdding(false);
    }
  };

  const handleAddIssue = async () => {
    console.log('原handleAddIssue被调用，现在不应该使用此函数');
    // 不执行实际操作
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
  const globalList = issues;
  const globalIssueIdList = globalList.map((issue) => issue.id);

  // 优化 onEdit 回调：状态变更后将 issue 移动到新分组最上面
  const handleCardEdit = (updatedIssue: Issue) => {
    console.log(
      'handleCardEdit called with issue:',
      updatedIssue.id,
      updatedIssue.status
    );

    setIssues((prev) => {
      // 先移除原有 issue
      const filtered = prev.filter((i) => i.id !== updatedIssue.id);

      // 寻找新状态的第一个issue的位置
      let insertIdx = 0;
      // 查找相同状态的第一个issue
      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i].status === updatedIssue.status) {
          insertIdx = i;
          break;
        }
      }

      // 将更新后的issue插入到该状态组的最前面
      const newArr = [...filtered];
      newArr.splice(insertIdx, 0, updatedIssue);
      return newArr;
    });
  };

  // 分组渲染
  const renderGroupedIssues = () => {
    // 如果正在加载，显示全局加载状态
    if (loading) {
      return <IssueListLoading />;
    }

    // 如果没有问题，显示空状态
    if (issues.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-10 text-center">
          <div className="text-gray-400 text-sm mb-2">暂无问题</div>
          <button
            onClick={() => {
              setAddStatus('todo');
              setShowModal(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
          >
            创建第一个问题
          </button>
        </div>
      );
    }

    // 先处理 todo 分组，永远显示
    const todoGroup = STATUS_GROUPS[0];
    const todoIssues = issues.filter((issue) => issue.status === todoGroup.key);
    const otherGroups = STATUS_GROUPS.slice(1);
    return (
      <>
        {/* Todo 分组永远显示 */}
        <div className="mb-2">
          <StatusGroupHeader
            status={todoGroup.key}
            label={todoGroup.label}
            count={todoIssues.length}
            onAddClick={() => {
              setAddStatus(todoGroup.key);
              setShowModal(true);
            }}
          />
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
                      onEdit={handleCardEdit}
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
              <StatusGroupHeader
                status={group.key}
                label={group.label}
                count={groupIssues.length}
                onAddClick={() => {
                  setAddStatus(group.key);
                  setShowModal(true);
                }}
              />
              <div className="bg-[#101011] pl-6">
                {groupIssues.map((issue) => {
                  const globalIndex = globalIssueIdList.findIndex(
                    (id) => id === issue.id
                  );
                  return (
                    <div key={issue.id}>
                      <IssueCard
                        issue={issue}
                        onEdit={handleCardEdit}
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
            const issueData = {
              title,
              description,
              status: status || addStatus,
            };
            console.log('Creating issue with data:', issueData);

            handleCreateIssue(
              issueData.title,
              issueData.description,
              issueData.status
            );
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
