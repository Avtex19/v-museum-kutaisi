'use client';

import { useState } from 'react';
import { uploadTurntableFrame, deleteAllTurntableFrames } from '@/lib/adminApi';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import type { ArtifactTurntableFrame } from '@/lib/types';

interface Props {
  slug: string;
  initialFrames: ArtifactTurntableFrame[];
}

export function TurntableUploader({ slug, initialFrames }: Props) {
  const [frameCount, setFrameCount] = useState(initialFrames.length);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [error, setError] = useState('');

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setError('');
    setUploading(true);
    setProgress({ current: 0, total: files.length });

    const total = files.length;
    for (let i = 0; i < files.length; i++) {
      const angle = Math.round((360 / total) * i);
      try {
        await uploadTurntableFrame(slug, files[i], i, angle);
        setProgress({ current: i + 1, total });
      } catch {
        setError(`Failed on frame ${i + 1}`);
        setUploading(false);
        setProgress(null);
        return;
      }
    }

    setUploading(false);
    setProgress(null);
    setFrameCount((prev) => prev + files.length);
    e.target.value = '';
  }

  async function handleDeleteAll() {
    setDeletingAll(true);
    try {
      await deleteAllTurntableFrames(slug);
      setFrameCount(0);
    } catch {
      setError('Failed to delete frames');
    } finally {
      setDeletingAll(false);
      setConfirmDeleteAll(false);
    }
  }

  return (
    <div className="space-y-3">
      {confirmDeleteAll && (
        <ConfirmModal
          message={`Delete all ${frameCount} turntable frames? This cannot be undone.`}
          onConfirm={handleDeleteAll}
          onCancel={() => setConfirmDeleteAll(false)}
          loading={deletingAll}
        />
      )}

      <label className="block text-sm text-neutral-400">360° Turntable</label>

      {frameCount > 0 ? (
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-neutral-800/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎞️</span>
            <div>
              <p className="text-sm font-medium text-neutral-100">{frameCount} frames uploaded</p>
              <p className="text-xs text-neutral-500">360° view is active</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConfirmDeleteAll(true)}
            className="cursor-pointer rounded-lg border border-red-600/50 px-3 py-1.5 text-xs text-red-400 hover:bg-red-600/10"
          >
            Delete All
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/20 px-4 py-3 text-sm text-neutral-500">
          No turntable frames yet
        </div>
      )}

      {uploading && progress && (
        <div className="space-y-1">
          <p className="text-xs text-neutral-400">
            Uploading frame {progress.current} / {progress.total}…
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full bg-amber-400 transition-all duration-200"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <input
        type="file"
        multiple
        accept="image/*"
        disabled={uploading}
        onChange={handleUpload}
        className="w-full text-sm text-neutral-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-amber-500/20 file:px-3 file:py-2 file:text-amber-300 hover:file:bg-amber-500/30 disabled:opacity-50"
      />
      <p className="text-xs text-neutral-500">
        Select all frames at once — uploaded in order with auto-calculated angles.
      </p>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
