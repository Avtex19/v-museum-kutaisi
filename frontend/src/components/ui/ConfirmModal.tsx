'use client';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmModal({ message, onConfirm, onCancel, loading }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-neutral-900 p-6">
        <p className="text-neutral-100">{message}</p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-lg bg-red-600 py-2.5 font-medium text-white hover:bg-red-500 disabled:opacity-50"
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-lg border border-white/10 py-2.5 text-neutral-300 hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
