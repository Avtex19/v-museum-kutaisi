import Link from "next/link";

type Props = {
  /** Current page (1-indexed). */
  page: number;
  /** Total number of items across all pages. */
  count: number;
  /** Items per page. */
  pageSize: number;
  /** Base href; query params are appended. */
  baseHref: string;
  /** Existing query params to preserve (filters, search, etc). */
  preserveParams?: Record<string, string | undefined>;
};

export function Pagination({
  page,
  count,
  pageSize,
  baseHref,
  preserveParams,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  if (totalPages <= 1) return null;

  const buildHref = (targetPage: number): string => {
    const params = new URLSearchParams();
    if (preserveParams) {
      for (const [k, v] of Object.entries(preserveParams)) {
        if (v) params.set(k, v);
      }
    }
    params.set("page", String(targetPage));
    return `${baseHref}?${params}`;
  };

  const prevHref = page > 1 ? buildHref(page - 1) : null;
  const nextHref = page < totalPages ? buildHref(page + 1) : null;

  return (
    <nav className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-sm">
      <PageLink href={prevHref}>← Prev</PageLink>

      <span className="text-neutral-400">
        Page <span className="text-neutral-100">{page}</span> of {totalPages}
      </span>

      <PageLink href={nextHref}>Next →</PageLink>
    </nav>
  );
}

function PageLink({
  href,
  children,
}: {
  href: string | null;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <span className="cursor-not-allowed text-neutral-700">{children}</span>
    );
  }
  return (
    <Link
      href={href}
      className="font-medium text-amber-300 transition hover:text-amber-200"
    >
      {children}
    </Link>
  );
}
