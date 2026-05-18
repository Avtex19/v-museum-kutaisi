'use client';

import { useState, useEffect } from 'react';
import { ArtifactCard } from '@/components/artifact/ArtifactCard';
import { AdminArtifactCard } from '@/components/admin/AdminArtifactCard';
import { CreateArtifactModal } from '@/components/admin/CreateArtifactModal';
import { ArtifactFilters } from '@/components/artifact/ArtifactFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { isAuthenticated } from '@/lib/auth';
import { translations } from '@/lib/translations';
import type { Lang } from '@/lib/translations';
import type { ArtifactListItem, Period, RoomListItem, Topic } from '@/lib/types';

interface Props {
  artifacts: ArtifactListItem[];
  roomSlug: string;
  periods: Period[];
  rooms: RoomListItem[];
  topics: Topic[];
  filterValues: { search?: string; category?: string; period?: string; ordering?: string };
  lang: Lang;
}

export function RoomDetailClient({ artifacts: initial, roomSlug, periods, rooms, topics, filterValues, lang }: Props) {
  const tr = translations[lang];
  const [artifacts, setArtifacts] = useState(initial);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showCreateArtifact, setShowCreateArtifact] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  function handleArtifactDeleted(slug: string) {
    setArtifacts((prev) => prev.filter((a) => a.slug !== slug));
  }

  function handleArtifactCreated() {
    setShowCreateArtifact(false);
    window.location.reload();
  }

  return (
    <>
      {showCreateArtifact && (
        <CreateArtifactModal
          periods={periods}
          rooms={rooms}
          topics={topics}
          defaultRoomSlug={roomSlug}
          onSuccess={handleArtifactCreated}
          onClose={() => setShowCreateArtifact(false)}
        />
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{tr.artifactsInRoom}</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500">
            {tr.itemCount(artifacts.length)}
          </span>
          {loggedIn && (
            <button
              onClick={() => setShowCreateArtifact(true)}
              className="cursor-pointer rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-amber-400"
            >
              {tr.addArtifact}
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <ArtifactFilters
          action={`/rooms/${roomSlug}`}
          values={filterValues}
          periods={periods}
          rooms={[]}
          lang={lang}
        />
      </div>

      {artifacts.length === 0 ? (
        <EmptyState>{tr.noArtifactsFilters}</EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artifacts.map((artifact) =>
            loggedIn ? (
              <AdminArtifactCard
                key={artifact.id}
                artifact={artifact}
                variant="compact"
                periods={periods}
                rooms={rooms}
                topics={topics}
                onDeleted={handleArtifactDeleted}
                onUpdated={() => window.location.reload()}
                lang={lang}
              />
            ) : (
              <ArtifactCard key={artifact.id} artifact={artifact} variant="compact" lang={lang} />
            )
          )}
        </div>
      )}
    </>
  );
}
