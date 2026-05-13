import Link from "next/link";

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm text-amber-300/90 transition hover:text-amber-200"
    >
      ← {children}
    </Link>
  );
}
