'use client';

import { useState, useEffect } from 'react';
import { RoomCard } from '@/components/room/RoomCard';
import { AdminRoomCard } from '@/components/admin/AdminRoomCard';
import { CreateRoomModal } from '@/components/admin/CreateRoomModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoginModal } from '@/components/auth/LoginModal';
import { isAuthenticated, logout } from '@/lib/auth';
import type { Period, RoomListItem, Topic } from '@/lib/types';

interface Props {
  rooms: RoomListItem[];
  periods: Period[];
  topics: Topic[];
}

export function HomeClient({ rooms: initial, periods, topics }: Props) {
  const [rooms, setRooms] = useState(initial);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  function handleLoginSuccess() {
    setLoggedIn(true);
    setShowLogin(false);
  }

  function handleLogout() {
    logout();
    setLoggedIn(false);
  }

  function handleRoomDeleted(slug: string) {
    setRooms((prev) => prev.filter((r) => r.slug !== slug));
  }

  function handleRoomCreated() {
    setShowCreateRoom(false);
    window.location.reload();
  }

  return (
    <>
      {showLogin && (
        <LoginModal onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
      )}
      {showCreateRoom && (
        <CreateRoomModal
          periods={periods}
          topics={topics}
          onSuccess={handleRoomCreated}
          onClose={() => setShowCreateRoom(false)}
        />
      )}

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <h2 className="text-2xl font-semibold">Choose a room</h2>
            <span className="text-sm text-neutral-400">
              {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} open
            </span>
          </div>

          <div className="flex items-center gap-3">
            {loggedIn ? (
              <>
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="cursor-pointer rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-amber-400"
                >
                  + Add Room
                </button>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-400 hover:bg-white/5"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="cursor-pointer rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-300 hover:bg-white/5"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>

        {rooms.length === 0 ? (
          <EmptyState>
            <p>No rooms yet.</p>
            <p className="mt-2 text-sm">
              Run{' '}
              <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-amber-300">
                python manage.py seed_rooms
              </code>{' '}
              to set up thematic rooms.
            </p>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) =>
              loggedIn ? (
                <AdminRoomCard key={room.id} room={room} onDeleted={handleRoomDeleted} />
              ) : (
                <RoomCard key={room.id} room={room} />
              )
            )}
          </div>
        )}
      </section>
    </>
  );
}
