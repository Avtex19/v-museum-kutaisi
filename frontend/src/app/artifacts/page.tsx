import { ArtifactCard } from "@/components/artifact/ArtifactCard";
import { ArtifactFilters } from "@/components/artifact/ArtifactFilters";
import { BackLink } from "@/components/ui/BackLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import {
  fetchArtifactsPage,
  fetchPeriods,
  fetchRooms,
  type ArtifactQuery,
} from "@/lib/api";
import { getLang } from "@/lib/lang";
import { translations } from "@/lib/translations";

const PAGE_SIZE = 12;

type SearchParams = {
  page?: string;
  search?: string;
  category?: string;
  period?: string;
  room?: string;
  ordering?: string;
};

export default async function AllArtifactsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const lang = await getLang();
  const tr = translations[lang];
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const query: ArtifactQuery = {
    page,
    pageSize: PAGE_SIZE,
    search: sp.search,
    category: sp.category,
    period: sp.period,
    room: sp.room,
    ordering: sp.ordering,
  };

  const [data, periods, rooms] = await Promise.all([
    fetchArtifactsPage(query),
    fetchPeriods(),
    fetchRooms(),
  ]);

  const hasFilters = Boolean(sp.search || sp.category || sp.period || sp.room);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <BackLink href="/">{tr.backAllRooms}</BackLink>

        <header className="mt-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
            {tr.catalogue}
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold tracking-tight">
            {tr.allArtifacts}
          </h1>
          <p className="mt-2 text-neutral-400">
            {tr.objectCount(data.count)}{" "}
            {hasFilters && tr.matchFilters}
          </p>
        </header>

        <div className="mt-8">
          <ArtifactFilters
            action="/artifacts"
            values={{
              search: sp.search,
              category: sp.category,
              period: sp.period,
              room: sp.room,
              ordering: sp.ordering,
            }}
            periods={periods}
            rooms={rooms}
            lang={lang}
          />
        </div>

        <section className="mt-10">
          {data.results.length === 0 ? (
            <EmptyState>{tr.noArtifactsMatch}</EmptyState>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.results.map((artifact) => (
                  <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    variant="compact"
                    lang={lang}
                  />
                ))}
              </div>

              <Pagination
                page={page}
                count={data.count}
                pageSize={PAGE_SIZE}
                baseHref="/artifacts"
                preserveParams={{
                  search: sp.search,
                  category: sp.category,
                  period: sp.period,
                  room: sp.room,
                  ordering: sp.ordering,
                }}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
