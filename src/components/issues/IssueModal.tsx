import Modal from '@/components/common/Modal';
import STATUS_OPTIONS from './statusOptions';
import { useState, useEffect } from 'react';

interface IssueModalProps {
  open: boolean;
  initialTitle?: string;
  initialDescription?: string;
  initialStatus?: string;
  loading?: boolean;
  onSave: (title: string, description: string, status: string) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function IssueModal({
  open,
  initialTitle = '',
  initialDescription = '',
  initialStatus = 'todo',
  loading = false,
  onSave,
  onCancel,
  isEdit = false,
}: IssueModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setStatus(initialStatus);
    }
  }, [open, initialTitle, initialDescription, initialStatus]);

  if (!open) return null;
  return (
    <Modal>
      <div className="modal-content card">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">
          {isEdit ? 'Edit Issue' : 'Add New Issue'}
        </h3>
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <textarea
          className="input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <select
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={loading}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
          <button
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(title, description, status)}
            className="btn-primary"
            disabled={loading || !title.trim() || !description.trim()}
          >
            {loading
              ? isEdit
                ? 'Saving...'
                : 'Adding...'
              : isEdit
                ? 'Save'
                : 'Add'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
