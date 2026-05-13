import { notFound } from "next/navigation";

import { ArtifactCard } from "@/components/artifact/ArtifactCard";
import { BackLink } from "@/components/ui/BackLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { fetchRoom } from "@/lib/api";
import type { RoomDetail } from "@/lib/types";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let room: RoomDetail;
  try {
    room = await fetchRoom(slug);
  } catch {
    notFound();
  }

  const title = room.name_en || room.name_ka;
  const description = room.description_en || room.description_ka;
  const audioSrc = room.audio_guide_en || room.audio_guide_ka;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <BackLink href="/">All rooms</BackLink>

        <header className="mt-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
            {room.topic?.name_en || room.topic?.name_ka || "Exhibition"}
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
                <SectionLabel>About this room</SectionLabel>
                <p className="mt-3 whitespace-pre-line text-neutral-300">
                  {description}
                </p>
              </div>
            )}
            {audioSrc && (
              <div>
                <SectionLabel>Audio guide</SectionLabel>
                <audio controls src={audioSrc} className="mt-3 w-full" />
              </div>
            )}
          </section>
        )}

        <section className="mt-14">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold">Artifacts in this room</h2>
            <span className="text-sm text-neutral-500">
              {room.artifacts.length}{" "}
              {room.artifacts.length === 1 ? "item" : "items"}
            </span>
          </div>

          {room.artifacts.length === 0 ? (
            <EmptyState>No artifacts in this room yet.</EmptyState>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {room.artifacts.map((artifact) => (
                <ArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  variant="compact"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
