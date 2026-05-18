"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-950 px-6 text-center text-neutral-100">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300/80">
        Something went wrong
      </p>
      <h1 className="font-serif text-4xl font-bold">Unable to load page</h1>
      <p className="max-w-sm text-neutral-400">
        The server may be temporarily unavailable. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-full border border-amber-300/40 px-6 py-2 text-sm font-medium text-amber-200 transition hover:border-amber-300 hover:bg-amber-300/10"
      >
        Try again
      </button>
    </main>
  );
}
