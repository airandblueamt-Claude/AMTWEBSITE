# AMT Website — Redesign & Deployment Notes

A working handoff/changelog for future updates. Captures what was built, how it's
deployed, and how to make the most common changes.

---

## 1. Live & repo

- **Live (production):** https://amt-website-dusky.vercel.app
- **Vercel project:** `amt-website` (team `rand-project-s-projects`)
- **Repo (fork, where this lives):** `github.com/airandblueamt-Claude/AMTWEBSITE`
  - Branch **`main`** → auto-deploys to **production** on every push (Git connected to Vercel)
  - Branch **`redesign-preview`** → auto-deploys a **preview** URL on push
  - `upstream`/`origin` is `RAHAFSALMAN7/AMTWEBSITE` (the original; open a PR there once approved)

## 2. Stack

Vite 5 · React 18 · TypeScript · Tailwind · Sanity (CMS) · framer-motion · react-i18next
(locale routing `/:locale/...`, EN + AR/RTL) · react-router · react-countup · ogl/react-bits.

## 3. What was added in this redesign

- **Light/Dark theme system** — `src/index.css` CSS variables (`:root[data-theme="dark"|"light"]`)
  + semantic Tailwind tokens in `tailwind.config.js`: `canvas, panel, ink, copy, muted,
  eyebrow, hairline`. Toggle (sun/moon) in `Header.tsx`, persisted in `localStorage["amt-theme"]`,
  no-flash init script in `index.html`. Default dark.
- **Brand color = the logo's crimson red `#D6132B`** (sampled from `src/assets/LOGOAMT.png`).
  Accent literals: `#d6132b` / `#f12942` (bright) / `#ff8493` (ember). Navy `#080844` is secondary.
- **AI assistant** — `src/components/AiAssistant.tsx` (replaced the old WhatsApp link). Talks to
  `/api/chat`. Inquiry form posts `/api/lead` AND opens WhatsApp pre-filled on submit.
- **Unified auto-scrolling rows** — `src/components/ScrollRow.tsx` is used by Solutions, the
  core-systems gallery, Partners, Clients, Testimonials, and Latest News. Continuous marquee-style
  auto-scroll + arrow buttons + pause-on-hover. (Auto-scroll is currently FORCED on, ignoring OS
  reduce-motion — by request. To respect it again, restore the `useReducedMotion` gate.)
- **New homepage sections** — `ImpactStats.tsx` (animated counters), `HomeTestimonials.tsx`,
  `FinalCTA.tsx`, `ScrollProgress.tsx`, branded `NotFound.tsx` (404). Order is in `pages/HomePage.tsx`.
- **`localize()` cleans CMS data** — `src/utils/localize.js` strips stray wrapping quotes/newlines
  that exist in many Sanity fields (e.g. `"ICT Solutions"` → `ICT Solutions`).
- **Local news item** — `src/data/localNews.ts` (the Nedap "Emerging Partner" post) is merged into
  Latest News + the article page without needing a Sanity write token. Images in `src/assets/news/`.
- **Code-split bundle** — `vite.config.ts` `manualChunks` (vendor-react/motion/sanity/i18n/icons).

## 4. Backend / API (serverless on Vercel)

The old Express server (`backend/`) is kept for local dev, but **production uses Vercel serverless
functions** in `api/`:

- `api/_amt.js` — shared AI logic (knowledge base, offline responder, provider dispatch).
- `api/chat.js` — `POST /api/chat`, the AI assistant (real model when a key is set, else scripted).
- `api/lead.js` — `POST /api/lead`, inquiry capture (emails if SMTP set, else WhatsApp + log).
- `api/sanity.js` — `POST /api/sanity`, **same-origin proxy for Sanity reads**. This is why content
  loads on any domain WITHOUT adding it to Sanity's CORS allowlist. `src/sanityClient.ts`'s
  `sanity.fetch` calls this proxy; `urlFor` still builds `cdn.sanity.io` image URLs directly.

`vercel.json`: build = `node scripts/generate-seo-files.mjs && vite build` (skips the Playwright
prerender, which can't run on Vercel); SPA rewrite sends all non-`/api` routes to `index.html`.
`.vercelignore` keeps `.env` and the old Express server out of deploys.

## 5. Environment variables (set in Vercel → Project → Settings → Environment Variables)

| Var | Value | Purpose |
|-----|-------|---------|
| `AI_PROVIDER` | `groq` | AI provider (also: gemini, openrouter, ollama, anthropic) |
| `AI_API_KEY`  | *(Groq key `gsk_…`)* | the assistant's model key |
| `AI_MODEL`    | `llama-3.3-70b-versatile` | optional override |
| `LEAD_TO`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | *(optional)* | emails inquiries instead of WhatsApp-only |

Keys are **never** committed (`.env` is gitignored). Rotate the Groq key anytime in console.groq.com.

## 6. How to make common updates

- **Edit page content / images / news (the normal way):** in **Sanity Studio** (project `lgtz8nod`).
  The site reads it live — no redeploy needed.
- **Deploy a code change:** push to `main` → Vercel auto-deploys to production. (Preview: push
  `redesign-preview`.) Manual deploy: `npx vercel deploy --prod --scope rand-project-s-projects`.
- **Change the brand accent color:** it's the literal `#d6132b` / `#f12942` / `#ff8493` across
  `src/**` + the CSS vars in `src/index.css`. (Originally swapped from orange via a repo-wide replace.)
- **Real homepage stats:** placeholders live in `Hero.tsx` (`STATS`) and `ImpactStats.tsx` — replace
  with real numbers.
- **Real testimonials / partner logos:** edit `clientsSection` (testimonials) and `partnersSection`
  in Sanity. Partner logos are currently text wordmarks where the CMS has no logo image.
- **Scroll speed:** the `speed` prop on `<ScrollRow speed={0.5}>` (default in `ScrollRow.tsx`).
- **Custom domain:** add it in Vercel → Project → Domains. The Sanity proxy means no extra CORS step.

## 7. Run locally

```bash
npm install
npm run dev                 # site → http://localhost:5173 (or 5174)
# AI + proxy backend (separate terminal):
cd backend && npm install
printf "AI_PROVIDER=groq\nAI_API_KEY=YOUR_KEY\n" > .env && npm start   # → :8787
```
The Vite dev server proxies `/api/*` → the backend on :8787.

## 8. Known TODOs / follow-ups

- Replace placeholder **stats** with real figures.
- Real **partner logo images** (vs. wordmarks) + genuine **client testimonials**.
- Configure **SMTP** if you want inquiries emailed (otherwise WhatsApp handoff).
- Publish the **Nedap news** into Sanity proper (currently a local item) when convenient.
- Open a **PR into `RAHAFSALMAN7/AMTWEBSITE`** once the redesign is approved.
- Verify the unverified **email** `info@amt-arabia.net` (only WhatsApp `966554593722` is confirmed).
