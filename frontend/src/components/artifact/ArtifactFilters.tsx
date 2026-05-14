import { ARTIFACT_CATEGORIES } from "@/lib/categories";
import type { Period, RoomListItem } from "@/lib/types";

type Props = {
  /** Form submits to this URL. */
  action: string;
  /** Current filter values from the URL. */
  values: {
    search?: string;
    category?: string;
    period?: string;
    room?: string;
    ordering?: string;
  };
  periods: Period[];
  rooms: RoomListItem[];
};

/**
 * GET form whose state is the URL. No client JS needed — submitting
 * navigates to the same page with the chosen filters as query params,
 * and the page component re-fetches accordingly.
 */
export function ArtifactFilters({ action, values, periods, rooms }: Props) {
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
        placeholder="Search by name, culture, material…"
        className="rounded-md border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400/40 focus:outline-none"
      />

      <Select name="category" value={values.category} placeholder="Category">
        {ARTIFACT_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </Select>

      <Select name="period" value={values.period} placeholder="Period">
        {periods.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name_en || p.name_ka}
          </option>
        ))}
      </Select>

      {rooms.length > 0 && (
        <Select name="room" value={values.room} placeholder="Room">
          {rooms.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name_en || r.name_ka}
            </option>
          ))}
        </Select>
      )}

      <Select name="ordering" value={values.ordering} placeholder="Sort">
        <option value="name_en">Name A→Z</option>
        <option value="-name_en">Name Z→A</option>
        <option value="-created_at">Newest</option>
        <option value="-view_count">Most viewed</option>
      </Select>

      <button
        type="submit"
        className="rounded-md bg-amber-400/90 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-300"
      >
        Apply
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
