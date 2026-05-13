"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Frame = {
  id: number;
  image: string;
  angle: number;
  order: number;
};

/**
 * Drag-to-rotate 360° viewer for a sequence of turntable frames.
 *
 * UX:
 *  - Pointer drag horizontally → frame index advances/retreats.
 *  - All frames are preloaded in the background so dragging is flicker-free.
 *  - Touch support comes for free via pointer events.
 */
export function TurntableViewer({ frames }: { frames: Frame[] }) {
  const sorted = useMemo(
    () => [...frames].sort((a, b) => a.order - b.order),
    [frames]
  );

  const [idx, setIdx] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const drag = useRef<{ startX: number; startIdx: number } | null>(null);

  // Preload every frame so dragging never shows a blank image
  useEffect(() => {
    let cancelled = false;
    setLoadedCount(0);
    sorted.forEach((f) => {
      const img = new window.Image();
      img.onload = () => {
        if (!cancelled) setLoadedCount((c) => c + 1);
      };
      img.src = f.image;
    });
    return () => {
      cancelled = true;
    };
  }, [sorted]);

  if (sorted.length === 0) return null;

  // Lower = more sensitive. ~6px per frame feels natural on desktop.
  const PIXELS_PER_FRAME = 6;
  const current = sorted[idx];
  const allLoaded = loadedCount === sorted.length;

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startX: e.clientX, startIdx: idx };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const len = sorted.length;
    let next = (drag.current.startIdx + Math.round(dx / PIXELS_PER_FRAME)) % len;
    if (next < 0) next += len;
    setIdx(next);
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <div
      className="relative aspect-square select-none touch-none overflow-hidden rounded-lg bg-neutral-900 ring-1 ring-white/10 cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.image}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain"
      />

      {!allLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-medium text-white backdrop-blur-sm">
          Loading 360° view… {loadedCount}/{sorted.length}
        </div>
      )}

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-xs font-medium text-white backdrop-blur">
        ← drag to rotate • {current.angle}°
      </div>
    </div>
  );
}
