"use client";

import { useState } from "react";

import { SectionLabel } from "@/components/ui/SectionLabel";

const COLLAPSE_THRESHOLD = 300;

export function AboutSection({
  text,
  label = "About this object",
  viewMore = "View more",
  viewLess = "View less",
}: {
  text: string;
  label?: string;
  viewMore?: string;
  viewLess?: string;
}) {
  const trimmed = text.trim();
  const isUrl = /^https?:\/\//i.test(trimmed);
  const isLong = !isUrl && trimmed.length > COLLAPSE_THRESHOLD;
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mt-10 border-t border-white/10 pt-6">
      <SectionLabel>{label}</SectionLabel>
      {isUrl ? (
        <a
          href={trimmed}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300/40 px-4 py-2 text-sm font-medium text-amber-200 transition hover:border-amber-300 hover:bg-amber-300/10"
        >
          View on The Met Museum
          <span aria-hidden>↗</span>
        </a>
      ) : (
        <>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-neutral-300">
            {isLong && !expanded
              ? trimmed.slice(0, COLLAPSE_THRESHOLD) + "…"
              : trimmed}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 text-sm font-medium text-amber-300 transition hover:text-amber-200"
            >
              {expanded ? viewLess : viewMore}
            </button>
          )}
        </>
      )}
    </section>
  );
}
