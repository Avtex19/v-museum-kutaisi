import Image from "next/image";

import { TurntableViewer } from "@/components/artifact/TurntableViewer";
import type { ArtifactDetail } from "@/lib/types";

/**
 * Picks the right primary visual for the artifact:
 *   1. Turntable viewer if frames exist
 *   2. Hero image if present
 *   3. "No image" placeholder
 */
export function ArtifactVisual({ artifact }: { artifact: ArtifactDetail }) {
  const heroUrl = artifact.hero_image?.image;
  const title = artifact.name_en || artifact.name_ka;

  if (artifact.turntable_frames.length > 0) {
    return (
      <div className="space-y-2">
        <TurntableViewer frames={artifact.turntable_frames} />
        <p className="text-center text-xs text-neutral-500">
          Drag to rotate · {artifact.turntable_frames.length} frames
        </p>
      </div>
    );
  }

  if (heroUrl) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-900 ring-1 ring-white/10">
        <Image
          src={heroUrl}
          alt={title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-square items-center justify-center rounded-lg bg-neutral-900 text-neutral-500 ring-1 ring-white/10">
      No image available
    </div>
  );
}
