'use client';

import { useState } from 'react';
import { ArtifactCard } from '@/components/artifact/ArtifactCard';
import { EditArtifactModal } from '@/components/admin/EditArtifactModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { deleteArtifact } from '@/lib/adminApi';
import type { ArtifactListItem, Period, RoomListItem, Topic } from '@/lib/types';

interface Props {
  artifact: ArtifactListItem;
  variant?: 'default' | 'compact';
  periods: Period[];
  rooms: RoomListItem[];
  topics: Topic[];
  onDeleted: (slug: string) => void;
  onUpdated: () => void;
}

export function AdminArtifactCard({ artifact, variant, periods, rooms, topics, onDeleted, onUpdated }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteArtifact(artifact.slug);
      onDeleted(artifact.slug);
    } catch {
      alert('Failed to delete artifact');
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <>
      {confirming && (
        <ConfirmModal
          message={`Are you sure you want to delete "${artifact.name_en || artifact.name_ka}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
          loading={deleting}
        />
      )}
      {editing && (
        <EditArtifactModal
          slug={artifact.slug}
          periods={periods}
          rooms={rooms}
          topics={topics}
          onSuccess={() => { setEditing(false); onUpdated(); }}
          onClose={() => setEditing(false)}
        />
      )}
      <div className="relative">
        <ArtifactCard artifact={artifact} variant={variant} />
        <div className="absolute right-2 top-2 z-10 flex gap-1">
          <button
            onClick={(e) => { e.preventDefault(); setEditing(true); }}
            className="cursor-pointer rounded bg-amber-500/90 px-2 py-1 text-xs font-medium text-black hover:bg-amber-400"
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setConfirming(true); }}
            className="cursor-pointer rounded bg-red-600/80 px-2 py-1 text-xs font-medium text-white hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
