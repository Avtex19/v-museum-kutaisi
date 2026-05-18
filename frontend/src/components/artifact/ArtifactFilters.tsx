import { ARTIFACT_CATEGORIES } from "@/lib/categories";
import { translations } from "@/lib/translations";
import type { Lang } from "@/lib/translations";
import type { Period, RoomListItem } from "@/lib/types";

type Props = {
  action: string;
  values: {
    search?: string;
    category?: string;
    period?: string;
    room?: string;
    ordering?: string;
  };
  periods: Period[];
  rooms: RoomListItem[];
  lang?: Lang;
};

export function ArtifactFilters({ action, values, periods, rooms, lang = "en" }: Props) {
  const tr = translations[lang];

  return (
    <form
      method="get"
      action={action}
      className="grid grid-cols-1 gap-3 rounded-lg border border-white/10 bg-neutral-900/50 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_repeat(4,_max-content)_max-content]"
    >
      <input
        type="search"
        name="search"
        defaultValue={values.search ?? ""}
        placeholder={tr.searchPlaceholder}
        className="rounded-md border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400/40 focus:outline-none"
      />

      <Select name="category" value={values.category} placeholder={tr.category}>
        {ARTIFACT_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </Select>

      <Select name="period" value={values.period} placeholder={tr.period}>
        {periods.map((p) => (
          <option key={p.slug} value={p.slug}>
            {lang === "ka" ? p.name_ka || p.name_en : p.name_en || p.name_ka}
          </option>
        ))}
      </Select>

      {rooms.length > 0 && (
        <Select name="room" value={values.room} placeholder={tr.room}>
          {rooms.map((r) => (
            <option key={r.slug} value={r.slug}>
              {lang === "ka" ? r.name_ka || r.name_en : r.name_en || r.name_ka}
            </option>
          ))}
        </Select>
      )}

      <Select name="ordering" value={values.ordering} placeholder={tr.sort}>
        <option value="name_en">{tr.sortNameAZ}</option>
        <option value="-name_en">{tr.sortNameZA}</option>
        <option value="-created_at">{tr.sortNewest}</option>
        <option value="-view_count">{tr.sortMostViewed}</option>
      </Select>

      <button
        type="submit"
        className="rounded-md bg-amber-400/90 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-300"
      >
        {tr.apply}
      </button>
    </form>
  );
}

function Select({
  name,
  value,
  placeholder,
  children,
}: {
  name: string;
  value?: string;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={value ?? ""}
      className="rounded-md border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-amber-400/40 focus:outline-none"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  );
}
