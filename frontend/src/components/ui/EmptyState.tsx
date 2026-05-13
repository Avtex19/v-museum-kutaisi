export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-white/20 bg-neutral-900/50 p-12 text-center text-neutral-400">
      {children}
    </div>
  );
}
