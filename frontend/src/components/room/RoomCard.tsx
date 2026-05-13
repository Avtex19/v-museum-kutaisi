import Image from "next/image";
import Link from "next/link";

import type { RoomListItem } from "@/lib/types";

export function RoomCard({ room }: { room: RoomListItem }) {
  const title = room.name_en || room.name_ka;
  const cover = room.cover_image_url ?? room.cover_image;

  return (
    <Link
      href={`/rooms/${room.slug}`}
      className="group relative block overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10 transition hover:ring-amber-400/50 hover:shadow-2xl hover:shadow-amber-900/20"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <RoomCoverPlaceholder title={title} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow">
            {title}
          </h3>
          {room.period?.era_display && (
            <p className="mt-1 text-sm text-neutral-200">
              {room.period.era_display}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm text-neutral-400">
          {room.artifact_count}{" "}
          {room.artifact_count === 1 ? "artifact" : "artifacts"}
        </span>
        <span className="text-sm font-medium text-amber-300 transition group-hover:translate-x-1 group-hover:text-amber-200">
          Enter →
        </span>
      </div>
    </Link>
  );
}

function RoomCoverPlaceholder({ title }: { title: string }) {
  const initial = title.trim().charAt(0).toUpperCase();
  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-900/40 via-neutral-900 to-neutral-950">
      <span className="font-serif text-7xl font-bold text-amber-300/30">
        {initial}
      </span>
    </div>
  );
}
