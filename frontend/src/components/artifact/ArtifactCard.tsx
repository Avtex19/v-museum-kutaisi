import Image from "next/image";
import Link from "next/link";

import { translations } from "@/lib/translations";
import type { Lang } from "@/lib/translations";
import type { ArtifactListItem } from "@/lib/types";

type Variant = "default" | "compact";

export function ArtifactCard({
  artifact,
  variant = "default",
  lang = "en",
}: {
  artifact: ArtifactListItem;
  variant?: Variant;
  lang?: Lang;
}) {
  const tr = translations[lang];
  const title = lang === "ka"
    ? artifact.name_ka || artifact.name_en
    : artifact.name_en || artifact.name_ka;
  const heroUrl = artifact.hero_image?.image;
  const isCompact = variant === "compact";

  return (
    <Link
      href={`/artifacts/${artifact.slug}`}
      className="group block overflow-hidden rounded-lg bg-neutral-900 ring-1 ring-white/10 transition hover:ring-amber-400/40"
    >
      <div
        className={`relative overflow-hidden bg-neutral-800 ${
          isCompact ? "aspect-square" : "aspect-[4/3]"
        }`}
      >
        {heroUrl ? (
          <Image
            src={heroUrl}
            alt={title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            {tr.noImage}
          </div>
        )}
        {artifact.has_360_view && (
          <span className="absolute right-2 top-2 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
            360°
          </span>
        )}
      </div>
      <div className={isCompact ? "p-3" : "p-4"}>
        <h3
          className={`line-clamp-1 font-medium text-neutral-100 ${
            isCompact ? "text-sm" : "text-base"
          }`}
        >
          {title}
        </h3>
        {!isCompact && artifact.period?.era_display && (
          <p className="mt-1 text-sm text-neutral-500">
            {artifact.period.era_display}
          </p>
        )}
        <p
          className={`uppercase tracking-wider text-neutral-500 ${
            isCompact ? "mt-0.5 text-xs" : "mt-2 text-xs"
          }`}
        >
          {artifact.category}
        </p>
      </div>
    </Link>
  );
}
