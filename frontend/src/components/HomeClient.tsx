'use client';

import { useState, useEffect } from 'react';
import { RoomCard } from '@/components/room/RoomCard';
import { AdminRoomCard } from '@/components/admin/AdminRoomCard';
import { CreateRoomModal } from '@/components/admin/CreateRoomModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';
import { LoginModal } from '@/components/auth/LoginModal';
import { isAuthenticated, logout } from '@/lib/auth';
import { translations } from '@/lib/translations';
import type { Lang } from '@/lib/translations';
import type { Period, RoomListItem, Topic } from '@/lib/types';

interface Props {
  rooms: RoomListItem[];
  periods: Period[];
  topics: Topic[];
  lang: Lang;
}

export function HomeClient({ rooms: initial, periods, topics, lang }: Props) {
  const tr = translations[lang];
  const [rooms, setRooms] = useState(initial);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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
    setToast(lang === 'ka' ? 'დარბაზი წარმატებით წაიშალა' : 'Room deleted successfully');
  }

  function handleRoomCreated() {
    setShowCreateRoom(false);
    window.location.reload();
  }

  return (
    <>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
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
            <h2 className="text-2xl font-semibold">{tr.chooseRoom}</h2>
            <span className="text-sm text-neutral-400">
              {tr.roomsOpen(rooms.length)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {loggedIn ? (
              <>
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="cursor-pointer rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-amber-400"
                >
                  {tr.addRoom}
                </button>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-400 hover:bg-white/5"
                >
                  {tr.logout}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="cursor-pointer rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-300 hover:bg-white/5"
              >
                {tr.adminLogin}
              </button>
            )}
          </div>
        </div>

        {rooms.length === 0 ? (
          <EmptyState>
            <p>{tr.noRoomsYet}</p>
            <p className="mt-2 text-sm">
              {tr.noRoomsSeed}{' '}
              <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-amber-300">
                {tr.noRoomsSeedCmd}
              </code>{' '}
              {tr.noRoomsSeedAfter}
            </p>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) =>
              loggedIn ? (
                <AdminRoomCard key={room.id} room={room} onDeleted={handleRoomDeleted} lang={lang} />
              ) : (
                <RoomCard key={room.id} room={room} lang={lang} />
              )
            )}
          </div>
        )}
      </section>
    </>
  );
}
