import { notFound } from "next/navigation";

import { BackLink } from "@/components/ui/BackLink";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RoomDetailClient } from "@/components/RoomDetailClient";
import { fetchRoom, fetchPeriods, fetchRooms, fetchTopics } from "@/lib/api";
import { getLang, pick } from "@/lib/lang";
import { translations } from "@/lib/translations";
import type { ArtifactListItem, RoomDetail } from "@/lib/types";

type SearchParams = {
  search?: string;
  category?: string;
  period?: string;
  ordering?: string;
};

export default async function RoomDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const filters = await searchParams;
  const lang = await getLang();
  const tr = translations[lang];

  let room: RoomDetail;
  try {
    room = await fetchRoom(slug);
  } catch {
    notFound();
  }

  const [periods, rooms, topics] = await Promise.all([
    fetchPeriods(),
    fetchRooms(),
    fetchTopics(),
  ]);

  const title = pick(lang, room.name_en, room.name_ka);
  const description = pick(lang, room.description_en, room.description_ka);
  const audioSrc = pick(lang, room.audio_guide_en, room.audio_guide_ka);
  const topicName = room.topic
    ? pick(lang, room.topic.name_en, room.topic.name_ka)
    : tr.exhibition;

  const filtered = applyFilters(room.artifacts, filters);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <BackLink href="/">{tr.backAllRooms}</BackLink>

        <header className="mt-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
            {topicName}
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold tracking-tight">
            {title}
          </h1>
          {room.period?.era_display && (
            <p className="mt-2 text-lg text-neutral-400">
              {room.period.era_display}
            </p>
          )}
        </header>

        {(description || audioSrc) && (
          <section className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {description && (
              <div className="md:col-span-2">
                <SectionLabel>{tr.aboutThisRoom}</SectionLabel>
                <p className="mt-3 whitespace-pre-line text-neutral-300">
                  {description}
                </p>
              </div>
            )}
            {audioSrc && (
              <div>
                <SectionLabel>{tr.audioGuide}</SectionLabel>
                <audio controls src={audioSrc} className="mt-3 w-full" />
              </div>
            )}
          </section>
        )}

        <section className="mt-14">
          <RoomDetailClient
            artifacts={filtered}
            roomSlug={slug}
            periods={periods}
            rooms={rooms}
            topics={topics}
            filterValues={filters}
            lang={lang}
          />
        </section>
      </div>
    </main>
  );
}

function applyFilters(
  artifacts: ArtifactListItem[],
  filters: SearchParams
): ArtifactListItem[] {
  let result = [...artifacts];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.name_en.toLowerCase().includes(q) ||
        a.name_ka.toLowerCase().includes(q)
    );
  }

  if (filters.category) {
    result = result.filter((a) => a.category === filters.category);
  }

  if (filters.period) {
    result = result.filter((a) => a.period.slug === filters.period);
  }

  if (filters.ordering) {
    result.sort((a, b) => {
      switch (filters.ordering) {
        case "name_en": return a.name_en.localeCompare(b.name_en);
        case "-name_en": return b.name_en.localeCompare(a.name_en);
        default: return 0;
      }
    });
  }

  return result;
}
