import { AlertTriangle } from 'lucide-react';
import type { Student } from '@/types/student';

interface DeleteConfirmModalProps {
  student: Student | null;
  count: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
  student,
  count,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!student && count === 0) return null;

  const isBulk = count > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-modal-in p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {isBulk ? `Delete ${count} Students?` : 'Delete Student?'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            {isBulk
              ? `Are you sure you want to delete ${count} student records? This action cannot be undone.`
              : <>Are you sure you want to delete <span className="font-semibold text-gray-700 dark:text-gray-200">{student?.name}</span>? This action cannot be undone.</>}
          </p>

          <div className="flex gap-3 w-full mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
