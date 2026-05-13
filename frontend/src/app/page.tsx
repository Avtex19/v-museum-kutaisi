import { RoomCard } from "@/components/room/RoomCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchRooms } from "@/lib/api";

export default async function HomePage() {
  const rooms = await fetchRooms();

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-neutral-950 to-neutral-950" />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300/80">
            Virtual Museum
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold tracking-tight">
            V-Museum Kutaisi
          </h1>
          <p className="mt-4 max-w-xl text-lg text-neutral-300">
            Step inside thematic rooms and explore Kutaisi&rsquo;s heritage —
            360° artifact views, hand-crafted annotations, and audio guides.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold">Choose a room</h2>
          <span className="text-sm text-neutral-400">
            {rooms.length} {rooms.length === 1 ? "room" : "rooms"} open
          </span>
        </div>

        {rooms.length === 0 ? (
          <EmptyState>
            <p>No rooms yet.</p>
            <p className="mt-2 text-sm">
              Run{" "}
              <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-amber-300">
                python manage.py seed_rooms
              </code>{" "}
              to set up thematic rooms.
            </p>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
