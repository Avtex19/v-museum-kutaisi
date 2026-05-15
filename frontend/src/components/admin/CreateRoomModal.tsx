'use client';

import { useState } from 'react';
import { createRoom } from '@/lib/adminApi';
import type { Period, Topic } from '@/lib/types';

interface Props {
  periods: Period[];
  topics: Topic[];
  onSuccess: () => void;
  onClose: () => void;
}

export function CreateRoomModal({ periods, topics, onSuccess, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const coverImage = form.get('cover_image') as File | null;
      await createRoom({
        name_ka: form.get('name_ka'),
        name_en: form.get('name_en'),
        period: form.get('period'),
        topic: form.get('topic') || null,
        description_ka: form.get('description_ka'),
        description_en: form.get('description_en'),
        is_published: form.get('is_published') === 'on',
        order: Number(form.get('order')) || 0,
        ...(coverImage && coverImage.size > 0 ? { cover_image: coverImage } : {}),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-neutral-900 p-8 overflow-y-auto max-h-[90vh]">
        <h2 className="mb-6 text-xl font-semibold text-neutral-100">Create Room</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name (Georgian)" name="name_ka" required />
          <Field label="Name (English)" name="name_en" />

          <div>
            <label className="mb-1 block text-sm text-neutral-400">Period *</label>
            <select name="period" required className={selectCls}>
              <option value="">Select period</option>
              {periods.map((p) => (
                <option key={p.id} value={p.id}>{p.name_en || p.name_ka}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-400">Topic</label>
            <select name="topic" className={selectCls}>
              <option value="">None</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name_en || t.name_ka}</option>
              ))}
            </select>
          </div>

          <Field label="Description (Georgian)" name="description_ka" multiline />
          <Field label="Description (English)" name="description_en" multiline />
          <Field label="Order" name="order" type="number" />

          <div>
            <label className="mb-1 block text-sm text-neutral-400">Cover Image</label>
            <input type="file" name="cover_image" accept="image/*" className="w-full text-sm text-neutral-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-amber-500/20 file:px-3 file:py-2 file:text-amber-300 hover:file:bg-amber-500/30" />
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
            <input type="checkbox" name="is_published" className="accent-amber-400" />
            Published
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 cursor-pointer rounded-lg bg-amber-500 py-2.5 font-medium text-neutral-950 hover:bg-amber-400 disabled:opacity-50">
              {loading ? 'Creating…' : 'Create'}
            </button>
            <button type="button" onClick={onClose}
              className="flex-1 cursor-pointer rounded-lg border border-white/10 py-2.5 text-neutral-300 hover:bg-white/5">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-white/10 bg-neutral-800 px-4 py-2.5 text-neutral-100 outline-none focus:border-amber-400';
const selectCls = 'w-full rounded-lg border border-white/10 bg-neutral-800 px-4 py-2.5 text-neutral-100 outline-none focus:border-amber-400';

function Field({ label, name, required, type = 'text', multiline }: {
  label: string; name: string; required?: boolean; type?: string; multiline?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-neutral-400">{label}{required && ' *'}</label>
      {multiline ? (
        <textarea name={name} rows={3} className={inputCls} />
      ) : (
        <input type={type} name={name} required={required} className={inputCls} />
      )}
    </div>
  );
}
