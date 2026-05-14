'use client';

import { useState } from 'react';
import { RoomCard } from '@/components/room/RoomCard';
import { deleteRoom } from '@/lib/adminApi';
import type { RoomListItem } from '@/lib/types';

interface Props {
  room: RoomListItem;
  onDeleted: (slug: string) => void;
}

export function AdminRoomCard({ room, onDeleted }: Props) {
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
    <div className="relative">
      <RoomCard room={room} />
      <div className="absolute right-3 top-3 z-10">
        {confirming ? (
          <div className="flex gap-1">
            <button onClick={handleDelete} disabled={loading}
              className="cursor-pointer rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50">
              {loading ? '…' : 'Confirm'}
            </button>
            <button onClick={() => setConfirming(false)}
              className="cursor-pointer rounded bg-neutral-700 px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-600">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={(e) => { e.preventDefault(); setConfirming(true); }}
            className="cursor-pointer rounded bg-red-600/80 px-2 py-1 text-xs font-medium text-white hover:bg-red-500">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
