"use client";

import { useRouter } from "next/navigation";

import type { Lang } from "@/lib/translations";

export function LanguageSwitcher({ lang }: { lang: Lang }) {
  const router = useRouter();

  function switchTo(next: Lang) {
    document.cookie = `lang=${next}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 p-0.5 text-xs font-medium">
      <button
        onClick={() => switchTo("en")}
        className={`rounded-full px-3 py-1 transition ${
          lang === "en"
            ? "bg-amber-300 text-neutral-950"
            : "text-neutral-400 hover:text-neutral-100"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchTo("ka")}
        className={`rounded-full px-3 py-1 transition ${
          lang === "ka"
            ? "bg-amber-300 text-neutral-950"
            : "text-neutral-400 hover:text-neutral-100"
        }`}
      >
        KA
      </button>
    </div>
  );
}
