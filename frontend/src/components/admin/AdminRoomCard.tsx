'use client';

import { useState } from 'react';
import { RoomCard } from '@/components/room/RoomCard';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { deleteRoom } from '@/lib/adminApi';
import type { Lang } from '@/lib/translations';
import type { RoomListItem } from '@/lib/types';

interface Props {
  room: RoomListItem;
  onDeleted: (slug: string) => void;
  lang?: Lang;
}

export function AdminRoomCard({ room, onDeleted, lang = "en" }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteRoom(room.slug);
      onDeleted(room.slug);
    } catch {
      alert('Failed to delete room');
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  return (
    <>
      {confirming && (
        <ConfirmModal
          message={`Are you sure you want to delete "${room.name_en || room.name_ka}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
          loading={loading}
        />
      )}
      <div className="relative">
        <RoomCard room={room} lang={lang} />
        <div className="absolute right-3 top-3 z-10">
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
