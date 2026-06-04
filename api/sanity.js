// Vercel serverless function: POST /api/sanity  — same-origin proxy for Sanity reads
// (browser never calls Sanity directly, so no CORS allowlist is needed).
const SANITY = "https://lgtz8nod.apicdn.sanity.io/v2024-01-01/data/query/production";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ result: null });
  const { query, params } = req.body || {};
  if (!query || typeof query !== "string") return res.status(400).json({ result: null, error: "missing query" });

  const u = new URL(SANITY);
  u.searchParams.set("query", query);
  if (params && typeof params === "object") {
    for (const [k, v] of Object.entries(params)) u.searchParams.set("$" + k, JSON.stringify(v));
  }
  try {
    const r = await fetch(u.toString(), { headers: { "User-Agent": "amt-web" } });
    if (!r.ok) return res.status(502).json({ result: null, error: "sanity " + r.status });
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ result: data.result ?? null });
  } catch (e) {
    return res.status(502).json({ result: null, error: String(e) });
  }
}
