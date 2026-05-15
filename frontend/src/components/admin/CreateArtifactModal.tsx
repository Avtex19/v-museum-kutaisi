'use client';

import { useState } from 'react';
import { createArtifact, uploadArtifactImage } from '@/lib/adminApi';
import { ARTIFACT_CATEGORIES } from '@/lib/categories';
import type { Period, RoomListItem, Topic } from '@/lib/types';

interface Props {
  periods: Period[];
  rooms: RoomListItem[];
  topics: Topic[];
  defaultRoomSlug?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function CreateArtifactModal({ periods, rooms, topics, defaultRoomSlug, onSuccess, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultRoom = rooms.find((r) => r.slug === defaultRoomSlug);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const topicIds = topics
      .filter((t) => form.get(`topic_${t.id}`) === 'on')
      .map((t) => t.id);
    try {
      const heroImage = form.get('hero_image') as File | null;
      const artifact = await createArtifact({
        name_ka: form.get('name_ka'),
        name_en: form.get('name_en'),
        period: form.get('period'),
        room: form.get('room'),
        topics: topicIds,
        category: form.get('category'),
        short_description_ka: form.get('short_description_ka'),
        short_description_en: form.get('short_description_en'),
        description_ka: form.get('description_ka'),
        description_en: form.get('description_en'),
        material: form.get('material'),
        date_range: form.get('date_range'),
        is_featured: form.get('is_featured') === 'on',
        is_published: form.get('is_published') === 'on',
      });
      if (heroImage && heroImage.size > 0) {
        await uploadArtifactImage(artifact.slug, heroImage, 'hero');
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create artifact');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-neutral-900 p-8 overflow-y-auto max-h-[90vh]">
        <h2 className="mb-6 text-xl font-semibold text-neutral-100">Create Artifact</h2>
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
            <label className="mb-1 block text-sm text-neutral-400">Room *</label>
            <select name="room" required defaultValue={defaultRoom?.id ?? ''} className={selectCls}>
              <option value="">Select room</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>{r.name_en || r.name_ka}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-400">Category</label>
            <select name="category" className={selectCls}>
              {ARTIFACT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <Field label="Short Description (Georgian)" name="short_description_ka" required multiline />
          <Field label="Short Description (English)" name="short_description_en" multiline />
          <Field label="Full Description (Georgian)" name="description_ka" required multiline />
          <Field label="Full Description (English)" name="description_en" multiline />
          <Field label="Material" name="material" />
          <Field label="Date Range" name="date_range" />

          <div>
            <label className="mb-1 block text-sm text-neutral-400">Hero Image</label>
            <input type="file" name="hero_image" accept="image/*" className="w-full text-sm text-neutral-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-amber-500/20 file:px-3 file:py-2 file:text-amber-300 hover:file:bg-amber-500/30" />
          </div>

          {topics.length > 0 && (
            <div>
              <label className="mb-2 block text-sm text-neutral-400">Topics</label>
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                  <label key={t.id} className="flex items-center gap-1.5 text-sm text-neutral-300 cursor-pointer">
                    <input type="checkbox" name={`topic_${t.id}`} className="accent-amber-400" />
                    {t.name_en || t.name_ka}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
              <input type="checkbox" name="is_featured" className="accent-amber-400" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
              <input type="checkbox" name="is_published" className="accent-amber-400" />
              Published
            </label>
          </div>

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
        <textarea name={name} rows={3} required={required} className={inputCls} />
      ) : (
        <input type={type} name={name} required={required} className={inputCls} />
      )}
    </div>
  );
}
