export function CategoryTag({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-amber-300">
      {children}
    </p>
  );
}
