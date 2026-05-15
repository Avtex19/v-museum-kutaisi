import { adminFetch } from './auth';

const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ?? 'http://localhost:8000';
const ADMIN = `${BASE}/api/admin`;

function toFormData(data: Record<string, unknown>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => fd.append(key, String(v)));
    } else if (value instanceof File) {
      fd.append(key, value);
    } else {
      fd.append(key, String(value));
    }
  }
  return fd;
}

async function adminFormFetch(url: string, method: string, data: Record<string, unknown>): Promise<void> {
  const res = await adminFetch(url, { method, body: toFormData(data) });
  if (!res.ok) throw new Error(await res.text());
}

export async function createRoom(data: Record<string, unknown>): Promise<void> {
  await adminFormFetch(`${ADMIN}/rooms/`, 'POST', data);
}

export async function updateRoom(slug: string, data: Record<string, unknown>): Promise<void> {
  await adminFormFetch(`${ADMIN}/rooms/${slug}/`, 'PATCH', data);
}

export async function deleteRoom(slug: string): Promise<void> {
  const res = await adminFetch(`${ADMIN}/rooms/${slug}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}

export async function createArtifact(data: Record<string, unknown>): Promise<{ slug: string }> {
  const res = await adminFetch(`${ADMIN}/artifacts/`, { method: 'POST', body: toFormData(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateArtifact(slug: string, data: Record<string, unknown>): Promise<void> {
  await adminFormFetch(`${ADMIN}/artifacts/${slug}/`, 'PATCH', data);
}

export async function deleteArtifact(slug: string): Promise<void> {
  const res = await adminFetch(`${ADMIN}/artifacts/${slug}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}

export async function uploadArtifactImage(slug: string, image: File, imageType = 'hero'): Promise<void> {
  const fd = new FormData();
  fd.append('image', image);
  fd.append('image_type', imageType);
  const res = await adminFetch(`${ADMIN}/artifacts/${slug}/upload-image/`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteArtifactImage(slug: string, imageId: number): Promise<void> {
  const res = await adminFetch(`${ADMIN}/artifacts/${slug}/images/${imageId}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}

export async function uploadTurntableFrame(slug: string, image: File, order: number, angle: number): Promise<void> {
  const fd = new FormData();
  fd.append('image', image);
  fd.append('order', String(order));
  fd.append('angle', String(angle));
  const res = await adminFetch(`${ADMIN}/artifacts/${slug}/turntable/`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteTurntableFrame(slug: string, frameId: number): Promise<void> {
  const res = await adminFetch(`${ADMIN}/artifacts/${slug}/turntable/${frameId}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteAllTurntableFrames(slug: string): Promise<void> {
  const res = await adminFetch(`${ADMIN}/artifacts/${slug}/turntable/all/`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}
