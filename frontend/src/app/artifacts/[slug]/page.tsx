import { notFound } from "next/navigation";

import { AboutSection } from "@/components/artifact/AboutSection";
import { ArtifactMediaViewer } from "@/components/artifact/ArtifactMediaViewer";
import { ArtifactMetadata } from "@/components/artifact/ArtifactMetadata";
import { AudioGuide } from "@/components/artifact/AudioGuide";
import { BackLink } from "@/components/ui/BackLink";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { fetchArtifact } from "@/lib/api";
import { getLang, pick } from "@/lib/lang";
import { translations, localizeEra, type Lang } from "@/lib/translations";
import type { ArtifactDetail } from "@/lib/types";

export default async function ArtifactDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lang = await getLang();
  const tr = translations[lang];

  let artifact: ArtifactDetail;
  try {
    artifact = await fetchArtifact(slug);
  } catch {
    notFound();
  }

  const title = pick(lang, artifact.name_en, artifact.name_ka);
  const lead = pick(lang, artifact.short_description_en, artifact.short_description_ka);
  const about = pick(lang, artifact.description_en, artifact.description_ka);
  const audioSrc = pick(lang, artifact.audio_annotation_en, artifact.audio_annotation_ka);
  const roomName = pick(lang, artifact.room.name_en, artifact.room.name_ka);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <BackLink href={`/rooms/${artifact.room.slug}`}>
          {tr.backTo} {roomName}
        </BackLink>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Visual */}
          <div>
            <ArtifactMediaViewer artifact={artifact} />
          </div>

          {/* Info */}
          <article className="min-w-0">
            <CategoryTag>{artifact.category}</CategoryTag>

            <h1 className="mt-3 font-serif text-5xl font-bold leading-tight tracking-tight">
              {title}
            </h1>

            <Meta artifact={artifact} lang={lang} />

            {lead && (
              <p className="mt-8 text-lg leading-relaxed text-neutral-200">
                {lead}
              </p>
            )}

            {audioSrc && (
              <div className="mt-8">
                <AudioGuide src={audioSrc} />
              </div>
            )}

            <ArtifactMetadata artifact={artifact} lang={lang} />

            {about && (
              <AboutSection
                text={about}
                label={tr.aboutThisObject}
                viewMore={tr.viewMore}
                viewLess={tr.viewLess}
              />
            )}
          </article>
        </div>
      </div>
    </main>
  );
}

function Meta({ artifact, lang }: { artifact: ArtifactDetail; lang: Lang }) {
  const parts = [
    localizeEra(artifact.period?.era_display, lang),
    artifact.culture,
    artifact.origin_location,
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-400">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-3">
          {i > 0 && <span className="text-neutral-700">·</span>}
          <span>{part}</span>
        </span>
      ))}
    </p>
  );
}
