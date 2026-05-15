'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TurntableViewer } from './TurntableViewer';
import type { ArtifactDetail } from '@/lib/types';

export function ArtifactMediaViewer({ artifact }: { artifact: ArtifactDetail }) {
  const heroImage = artifact.hero_image;
  const otherImages = artifact.images.filter((img) => img.image_type !== 'hero');
  const allImages = heroImage ? [heroImage, ...otherImages] : otherImages;

  const [activeIdx, setActiveIdx] = useState(0);
  const [show360, setShow360] = useState(false);

  const has360 = artifact.turntable_frames.length > 0;
  const hasImages = allImages.length > 0;
  const title = artifact.name_en || artifact.name_ka;

  const prev = () => setActiveIdx((i) => (i - 1 + allImages.length) % allImages.length);
  const next = () => setActiveIdx((i) => (i + 1) % allImages.length);

  return (
    <div className="space-y-3">
      {show360 ? (
        <div className="relative">
          <TurntableViewer frames={artifact.turntable_frames} />
          <button
            onClick={() => setShow360(false)}
            className="absolute top-3 right-3 z-10 cursor-pointer rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-black/90"
          >
            ✕ Exit 360°
          </button>
        </div>
      ) : hasImages ? (
        <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-900 ring-1 ring-white/10">
          <Image
            src={allImages[activeIdx].image}
            alt={allImages[activeIdx].caption_en || title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain"
            priority={activeIdx === 0}
          />

          {allImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/60 p-2 text-white backdrop-blur hover:bg-black/80"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/60 p-2 text-white backdrop-blur hover:bg-black/80"
                aria-label="Next image"
              >
                ›
              </button>
              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
                {activeIdx + 1} / {allImages.length}
              </div>
            </>
          )}

          {has360 && (
            <button
              onClick={() => setShow360(true)}
              className="absolute top-3 right-3 cursor-pointer rounded-full bg-amber-500/90 px-3 py-1.5 text-xs font-semibold text-neutral-950 backdrop-blur hover:bg-amber-400"
            >
              360° View
            </button>
          )}
        </div>
      ) : has360 ? (
        <div className="relative">
          <TurntableViewer frames={artifact.turntable_frames} />
        </div>
      ) : (
        <div className="flex aspect-square items-center justify-center rounded-lg bg-neutral-900 text-neutral-500 ring-1 ring-white/10">
          No image available
        </div>
      )}

      {!show360 && allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(i)}
              className={`relative h-16 w-16 flex-none cursor-pointer overflow-hidden rounded ring-2 transition-all ${
                i === activeIdx ? 'ring-amber-400' : 'ring-white/10 hover:ring-white/30'
              }`}
            >
              <Image src={img.image} alt={img.caption_en || ''} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
