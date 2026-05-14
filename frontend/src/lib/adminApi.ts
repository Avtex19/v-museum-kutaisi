import { adminFetch } from './auth';

const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ?? 'http://localhost:8000';
const ADMIN = `${BASE}/api/admin`;

export async function createRoom(data: Record<string, unknown>): Promise<void> {
  const res = await adminFetch(`${ADMIN}/rooms/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteRoom(slug: string): Promise<void> {
  const res = await adminFetch(`${ADMIN}/rooms/${slug}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}

export async function createArtifact(data: Record<string, unknown>): Promise<void> {
  const res = await adminFetch(`${ADMIN}/artifacts/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function updateArtifact(slug: string, data: Record<string, unknown>): Promise<void> {
  const res = await adminFetch(`${ADMIN}/artifacts/${slug}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteArtifact(slug: string): Promise<void> {
  const res = await adminFetch(`${ADMIN}/artifacts/${slug}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}

export async function updateRoom(slug: string, data: Record<string, unknown>): Promise<void> {
  const res = await adminFetch(`${ADMIN}/rooms/${slug}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
}
