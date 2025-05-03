'use client';
import Modal from '@/components/common/Modal';

interface ConfirmDeleteModalProps {
  open: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  open,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!open) return null;
  return (
    <Modal>
      <div className="modal-content card">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Delete Issue</h3>
        <p>Are you sure you want to delete this issue?</p>
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
          <button
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
