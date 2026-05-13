/**
 * Type-safe client for the Django REST Framework backend.
 *
 * SSR fetches go through the docker network host (`http://backend:8000`)
 * while browser fetches use the host port (`http://localhost:8000`).
 * URLs returned by DRF inherit whichever Host header was seen, so we
 * rewrite the internal hostname back to the public one before returning.
 */

import type {
  ArtifactDetail,
  ArtifactListItem,
  Paginated,
  Period,
  RoomDetail,
  RoomListItem,
  Topic,
} from "./types";

const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? PUBLIC_API_URL;

const PUBLIC_ORIGIN = PUBLIC_API_URL.replace(/\/api\/?$/, "");
const INTERNAL_ORIGIN = INTERNAL_API_URL.replace(/\/api\/?$/, "");

function apiBase(): string {
  return typeof window === "undefined" ? INTERNAL_API_URL : PUBLIC_API_URL;
}

function normalizeMediaUrls<T>(data: T): T {
  if (INTERNAL_ORIGIN === PUBLIC_ORIGIN) return data;
  const json = JSON.stringify(data).split(INTERNAL_ORIGIN).join(PUBLIC_ORIGIN);
  return JSON.parse(json) as T;
}

function unwrap<T>(data: T[] | Paginated<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText} — ${path}`);
  }
  return normalizeMediaUrls((await res.json()) as T);
}

// ─── Rooms ──────────────────────────────────────────────────────────────────

export function fetchRooms(): Promise<RoomListItem[]> {
  return getJSON<RoomListItem[] | Paginated<RoomListItem>>("/rooms/").then(unwrap);
}

export function fetchRoom(slug: string): Promise<RoomDetail> {
  return getJSON<RoomDetail>(`/rooms/${slug}/`);
}

// ─── Artifacts ──────────────────────────────────────────────────────────────

export type ArtifactQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  period?: string;          // period slug
  room?: string;            // room slug
  topic?: string;           // topic slug
  ordering?: string;        // e.g. "name_en", "-created_at"
};

/** Paginated artifact list with optional filters and search. */
export function fetchArtifactsPage(
  query: ArtifactQuery = {},
): Promise<Paginated<ArtifactListItem>> {
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  if (query.pageSize) params.set("page_size", String(query.pageSize));
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.period) params.set("period__slug", query.period);
  if (query.room) params.set("room__slug", query.room);
  if (query.topic) params.set("topics__slug", query.topic);
  if (query.ordering) params.set("ordering", query.ordering);
  return getJSON<Paginated<ArtifactListItem>>(`/artifacts/?${params}`);
}

export function fetchArtifact(slug: string): Promise<ArtifactDetail> {
  return getJSON<ArtifactDetail>(`/artifacts/${slug}/`);
}

// ─── Taxonomy ───────────────────────────────────────────────────────────────

export function fetchPeriods(): Promise<Period[]> {
  return getJSON<Period[] | Paginated<Period>>("/periods/").then(unwrap);
}

export function fetchTopics(): Promise<Topic[]> {
  return getJSON<Topic[] | Paginated<Topic>>("/topics/").then(unwrap);
}
