import Image from "next/image";

import type { ArtifactImage } from "@/lib/types";

export function ArtifactGallery({ images }: { images: ArtifactImage[] }) {
  if (images.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {images.map((img) => (
        <div
          key={img.id}
          className="relative h-20 w-20 flex-none overflow-hidden rounded bg-neutral-900 ring-1 ring-white/10"
        >
          <Image
            src={img.image}
            alt={img.caption_en || ""}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
