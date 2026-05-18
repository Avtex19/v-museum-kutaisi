import { fetchRooms, fetchPeriods, fetchTopics } from "@/lib/api";
import { getLang } from "@/lib/lang";
import { translations } from "@/lib/translations";
import { HomeClient } from "@/components/HomeClient";

export default async function HomePage() {
  const lang = await getLang();
  const tr = translations[lang];

  let rooms: Awaited<ReturnType<typeof fetchRooms>> = [];
  let periods: Awaited<ReturnType<typeof fetchPeriods>> = [];
  let topics: Awaited<ReturnType<typeof fetchTopics>> = [];
  try {
    [rooms, periods, topics] = await Promise.all([
      fetchRooms(),
      fetchPeriods(),
      fetchTopics(),
    ]);
  } catch {
    // leave as empty arrays
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-neutral-950 to-neutral-950" />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300/80">
            {tr.virtualMuseum}
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold tracking-tight">
            {tr.siteTitle}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-neutral-300">
            {tr.siteDesc}
          </p>
        </div>
      </header>

      <HomeClient rooms={rooms} periods={periods} topics={topics} lang={lang} />
    </main>
  );
}
