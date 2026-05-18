import { cookies } from "next/headers";

import type { Lang } from "./translations";

export type { Lang };

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const val = store.get("lang")?.value;
  return val === "ka" ? "ka" : "en";
}

export function pick<T>(lang: Lang, en: T, ka: T | null | undefined): T {
  return lang === "ka" ? (ka ?? en) : (en ?? ka ?? en);
}
