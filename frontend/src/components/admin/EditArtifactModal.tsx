'use client';

import { useState, useEffect } from 'react';
import { updateArtifact } from '@/lib/adminApi';
import { fetchArtifact } from '@/lib/api';
import { ARTIFACT_CATEGORIES } from '@/lib/categories';
import type { ArtifactDetail, Period, RoomListItem, Topic } from '@/lib/types';

interface Props {
  slug: string;
  periods: Period[];
  rooms: RoomListItem[];
  topics: Topic[];
  onSuccess: () => void;
  onClose: () => void;
}

export function EditArtifactModal({ slug, periods, rooms, topics, onSuccess, onClose }: Props) {
  const [artifact, setArtifact] = useState<ArtifactDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArtifact(slug).then(setArtifact).catch(() => setError('Failed to load artifact'));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!artifact) return;
    setError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const topicIds = topics
      .filter((t) => form.get(`topic_${t.id}`) === 'on')
      .map((t) => t.id);
    try {
      await updateArtifact(slug, {
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
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update artifact');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-neutral-900 p-8 overflow-y-auto max-h-[90vh]">
        <h2 className="mb-6 text-xl font-semibold text-neutral-100">Edit Artifact</h2>

        {!artifact && !error && (
          <p className="text-neutral-400">Loading…</p>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        {artifact && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name (Georgian)" name="name_ka" required defaultValue={artifact.name_ka} />
            <Field label="Name (English)" name="name_en" defaultValue={artifact.name_en} />

            <div>
              <label className="mb-1 block text-sm text-neutral-400">Period *</label>
              <select name="period" required defaultValue={artifact.period.id} className={selectCls}>
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>{p.name_en || p.name_ka}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-neutral-400">Room *</label>
              <select name="room" required defaultValue={artifact.room.id} className={selectCls}>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>{r.name_en || r.name_ka}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-neutral-400">Category</label>
              <select name="category" defaultValue={artifact.category} className={selectCls}>
                {ARTIFACT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <Field label="Short Description (Georgian)" name="short_description_ka" required multiline defaultValue={artifact.short_description_ka} />
            <Field label="Short Description (English)" name="short_description_en" multiline defaultValue={artifact.short_description_en} />
            <Field label="Full Description (Georgian)" name="description_ka" required multiline defaultValue={artifact.description_ka} />
            <Field label="Full Description (English)" name="description_en" multiline defaultValue={artifact.description_en} />
            <Field label="Material" name="material" defaultValue={artifact.material} />
            <Field label="Date Range" name="date_range" defaultValue={artifact.date_range} />

            {topics.length > 0 && (
              <div>
                <label className="mb-2 block text-sm text-neutral-400">Topics</label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <label key={t.id} className="flex items-center gap-1.5 text-sm text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        name={`topic_${t.id}`}
                        defaultChecked={artifact.topics.some((at) => at.id === t.id)}
                        className="accent-amber-400"
                      />
                      {t.name_en || t.name_ka}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input type="checkbox" name="is_featured" defaultChecked={artifact.is_featured} className="accent-amber-400" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input type="checkbox" name="is_published" defaultChecked={artifact.is_published} className="accent-amber-400" />
                Published
              </label>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex-1 cursor-pointer rounded-lg bg-amber-500 py-2.5 font-medium text-neutral-950 hover:bg-amber-400 disabled:opacity-50">
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={onClose}
                className="flex-1 cursor-pointer rounded-lg border border-white/10 py-2.5 text-neutral-300 hover:bg-white/5">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-white/10 bg-neutral-800 px-4 py-2.5 text-neutral-100 outline-none focus:border-amber-400';
const selectCls = 'w-full rounded-lg border border-white/10 bg-neutral-800 px-4 py-2.5 text-neutral-100 outline-none focus:border-amber-400';

function Field({ label, name, required, type = 'text', multiline, defaultValue }: {
  label: string; name: string; required?: boolean; type?: string; multiline?: boolean; defaultValue?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-neutral-400">{label}{required && ' *'}</label>
      {multiline ? (
        <textarea name={name} rows={3} required={required} defaultValue={defaultValue ?? ''} className={inputCls} />
      ) : (
        <input type={type} name={name} required={required} defaultValue={defaultValue ?? ''} className={inputCls} />
      )}
    </div>
  );
}
