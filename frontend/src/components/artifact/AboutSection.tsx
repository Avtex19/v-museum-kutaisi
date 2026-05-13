import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Renders the "About" block for an artifact. If the description is just
 * a URL (some of our seeded data only has a Met link), show a styled
 * external-link button instead of an ugly URL string.
 */
export function AboutSection({ text }: { text: string }) {
  const trimmed = text.trim();
  const isUrl = /^https?:\/\//i.test(trimmed);

  return (
    <section className="mt-10 border-t border-white/10 pt-6">
      <SectionLabel>About this object</SectionLabel>
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
        <p className="mt-3 whitespace-pre-line leading-relaxed text-neutral-300">
          {trimmed}
        </p>
      )}
    </section>
  );
}
