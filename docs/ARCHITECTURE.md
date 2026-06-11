# CarbonWise Coach — Architecture & Project Structure

> **Hackathon judges & reviewers:** See **[../EVALUATION.md](../EVALUATION.md)** for a 60-second demo path, verification commands, and evaluation highlights.  
> **Visual documentation:** Open **[index.html](./index.html)** in your browser for interactive flow diagrams, tab maps, CI pipelines, and the full project guide. Run `npm run docs:open` to serve locally. After production build, docs are also at `/docs/` on the live site.

## High-level flow

```
Landing → Onboarding → Dashboard (tabbed) ↔ Smart Coach
                              ↓
                    localStorage (profile, history, challenges)
```

See the HTML docs for illustrated versions of this flow, data persistence, API paths, and deployment.

- **Client**: React 19 SPA built with Vite; all user data persists in `localStorage`.
- **Server**: Express (`server.ts`) serves the built SPA and exposes `/api/coach-insights` and `/api/coach-chat` when run via `npm run dev` or `npm run start`.
- **Production (Netlify)**: Static deploy from `dist/` — SPA + assets only. Express API routes do **not** run unless you add Netlify Functions or a separate backend. Smart Coach falls back to the client-side rules engine when API calls fail.

---

## Directory layout

```
CarbonWise_Coach/
├── .github/workflows/ci.yml   # Lint, coverage, build, Playwright E2E
├── docs/
│   └── ARCHITECTURE.md        # This file
├── e2e/                       # Playwright smoke tests
├── public/                    # Static assets (favicon, og-image, robots, sitemap, manifest)
├── src/
│   ├── App.tsx                # Routing, onboarding gate, lazy-loaded views
│   ├── components/
│   │   ├── Dashboard.tsx      # Thin orchestrator (~150 lines)
│   │   ├── dashboard/         # Tab panels & dashboard UI (see below)
│   │   ├── SmartCoach.tsx
│   │   ├── Onboarding.tsx
│   │   ├── Landing.tsx
│   │   ├── Achievements.tsx
│   │   ├── PeerComparison.tsx
│   │   ├── CarbonFootprintArt.tsx
│   │   ├── EmissionBar.tsx    # Shared progress-bar UI
│   │   └── …modals, widgets
│   ├── hooks/
│   │   ├── useDashboardState.ts   # Dashboard state, simulation, handlers
│   │   └── useModalA11y.ts        # Focus trap for modals
│   ├── utils/
│   │   ├── carbonCalculator.ts
│   │   ├── recommendations.ts
│   │   ├── apiValidation.ts       # Zod schemas for AI I/O
│   │   ├── storageValidation.ts
│   │   ├── footprintBreakdown.ts  # Category % and primary emitter
│   │   ├── weekDays.ts            # Mon–Sun week helper
│   │   ├── pdfGenerator.ts
│   │   └── presets.ts
│   └── types.ts
├── server.ts                  # Express + Gemini API (local/production Node)
├── vite.config.ts             # Build, manual chunks, SEO meta plugin
├── netlify.toml               # Netlify build, SPA redirects, security headers
└── .env.example
```

---

## Dashboard architecture

The dashboard uses a **tabbed layout** to reduce scroll fatigue. Four sticky tabs keep deep content one click away.

| Tab | ID | Contents |
|-----|-----|----------|
| **Overview** | `overview` | Quick-win teaser, footprint art / gauge, emissions breakdown, peer comparison, Smart Coach CTA |
| **Take Action** | `action` | Full daily quick-win card, weekly habit challenges |
| **Simulator** | `tools` | What-if carbon sandbox (sliders + apply to profile) |
| **Progress** | `progress` | Achievements, history chart, log list, calculation sources |

### Module map (`src/components/dashboard/`)

| File | Responsibility |
|------|----------------|
| `types.ts` | `DashboardTab`, `ScoreViewMode`, `QuickWinTip`, `EmissionCategory` |
| `constants.ts` | `DASHBOARD_TABS`, `QUICK_WIN_TIPS` |
| `DashboardHeader.tsx` | Compact welcome bar, footprint summary, action buttons |
| `DashboardTabNav.tsx` | Sticky accessible tab list |
| `DashboardOverviewTab.tsx` | Overview panel composition |
| `QuickWinCard.tsx` | `teaser` (overview) and `full` (action tab) variants |
| `CarbonScoreGauge.tsx` | Meter view when art view is toggled off |
| `EmissionsBreakdown.tsx` | Category bars via `EmissionBar` |
| `WeeklyChallenges.tsx` | 7-day streak grids per challenge |
| `CarbonSandbox.tsx` | Simulator sliders and prediction panel |
| `CarbonHistory.tsx` | Trend chart + log list |
| `DashboardToast.tsx` | Fixed bottom-right success toasts |

### State & logic (`useDashboardState`)

The hook centralizes:

- Tab and score view mode
- Quick-win index / completion
- Sandbox simulation inputs and derived totals
- Toast, PDF export, JSON download, weekly log simulation
- Derived values: classification, category percentages, primary emitter, active tip

Pure helpers live in `footprintBreakdown.ts` and `weekDays.ts` so they can be unit-tested independently.

---

## API surface (Express)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/coach-insights` | POST | Structured coaching insights from footprint + profile |
| `/api/coach-chat` | POST | Conversational Smart Coach (Gemini) |

Both endpoints:

- Require `GEMINI_API_KEY` on the server
- Use Zod validation on request bodies
- Are rate-limited (60 requests / 15 min)
- Validate AI responses before returning JSON

---

## Build & SEO

`vite.config.ts` includes a `seoMetaPlugin` that replaces `__APP_URL__` placeholders in `index.html` at build time with `process.env.APP_URL` (fallback: Netlify production URL).

Affected assets:

- Canonical URL, Open Graph, Twitter Card image URLs
- JSON-LD `WebApplication` schema

---

## Testing strategy

| Layer | Tool | Location |
|-------|------|----------|
| Unit / component | Vitest + Testing Library | `src/**/*.test.ts(x)` |
| E2E | Playwright | `e2e/smoke.spec.ts` |
| CI | GitHub Actions | `.github/workflows/ci.yml` |

CI runs on push/PR to `main` or `master`: lint → coverage → build → separate E2E job.

---

## Environment variables

| Variable | Required | Where used |
|----------|----------|------------|
| `GEMINI_API_KEY` | Optional locally; needed for live AI on Node server | `server.ts` only — never sent to browser |
| `APP_URL` | Recommended for production builds | Vite SEO plugin → `index.html` meta tags |

Copy `.env.example` to `.env` for local development.

---

## Deployment notes

### Netlify (current production)

- **URL**: https://carbonwisecoach.netlify.app
- **Build**: `npm run build` → publish `dist/`
- **Config**: `netlify.toml` (Node 22, SPA fallback, security headers)
- Set `APP_URL` and optionally `GEMINI_API_KEY` in Netlify env vars (API key only helps if server code runs — see caveat above)

### Node server (full stack)

```bash
npm run build
npm run start   # serves dist/ + /api/* on PORT (default 3000)
```

Use this when you need Gemini-backed Smart Coach without Netlify Functions.
