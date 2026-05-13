export function AudioGuide({ src }: { src: string }) {
  return (
    <div className="rounded-lg border border-amber-300/20 bg-amber-300/[0.03] p-5">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
        ◀ Audio guide
      </p>
      <audio controls src={src} className="w-full" />
    </div>
  );
}
