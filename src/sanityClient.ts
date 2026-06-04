import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const config = { projectId: "lgtz8nod", dataset: "production", apiVersion: "2024-01-01", useCdn: true };

// Real client kept ONLY for building image URLs (pure string work — no network call).
const imageClient = createClient(config);
const builder = createImageUrlBuilder(imageClient);

// CMS reads go through our own same-origin /api/sanity proxy instead of calling
// Sanity directly from the browser. This avoids Sanity's CORS allowlist entirely,
// so the site works on any domain (Vercel previews, custom domains) with no config.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function proxyFetch(query: string, params?: Record<string, unknown>): Promise<any> {
  const res = await fetch("/api/sanity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, params: params ?? {} }),
  });
  if (!res.ok) throw new Error("sanity proxy " + res.status);
  const data = await res.json();
  return data.result;
}

// Drop-in for the app's `sanity.fetch(query, params)` calls.
export const sanity = { fetch: proxyFetch };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => builder.image(source);
