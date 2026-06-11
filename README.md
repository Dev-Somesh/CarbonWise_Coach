# CarbonWise Coach — Sustainable Climate Assistant

**Live demo:** [https://carbonwisecoach.netlify.app](https://carbonwisecoach.netlify.app)  
**Repository:** [github.com/Dev-Somesh/CarbonWise_Coach](https://github.com/Dev-Somesh/CarbonWise_Coach)

CarbonWise Coach is a personal sustainability hub that estimates annual greenhouse gas output (kg CO₂e), suggests targeted habits, and keeps users engaged through challenges, benchmarking, achievements, and AI coaching.

---

## Key features

### Carbon footprint assessment
Calculates baseline emissions across four sectors:

- **Transportation** — commute distance, mode, flights
- **Diet** — meat frequency, sourcing, waste
- **Home utilities** — energy use, clean tariff choices
- **Shopping** — consumption and device lifecycle habits

### Tabbed dashboard (UX)
The dashboard is organized into four tabs to avoid long single-page scrolling:

| Tab | What you get |
|-----|----------------|
| **Overview** | Footprint score, category breakdown, global/regional comparison |
| **Take Action** | Daily quick wins + weekly habit challenge tracker |
| **Simulator** | What-if sliders (diet, transport, energy) before applying changes |
| **Progress** | Badges, history chart, carbon logs |

**Documentation:**
- **[Visual HTML docs](docs/index.html)** — flows, architecture diagrams, full project guide (open in browser or run `npm run docs:open`)
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — markdown reference

### Other capabilities

- **Historical trends** — Recharts timeline of logged footprints
- **Achievements** — Unlock badges for milestones (explorer, eco champion, etc.)
- **PDF reports** — Client-side jsPDF journey summary
- **Smart Coach** — Gemini-powered chat and insights (rules-engine fallback when API unavailable)
- **Accessibility** — Skip link, modal focus traps, `jsx-a11y` lint rules, ARIA on tabs and progress bars

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | React 19, TypeScript, Vite 6 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| PDF | jsPDF |
| Server | Express (local / Node deploy) |
| AI | `@google/genai` (Gemini, server-side only) |
| Validation | Zod |
| Tests | Vitest, Testing Library, Playwright |
| CI | GitHub Actions |

---

## Project structure (summary)

```
src/
├── App.tsx                 # App shell, onboarding, navigation
├── components/
│   ├── Dashboard.tsx       # Dashboard orchestrator
│   ├── dashboard/          # Tab panels (header, sandbox, history, …)
│   ├── SmartCoach.tsx
│   └── …
├── hooks/
│   ├── useDashboardState.ts
│   └── useModalA11y.ts
└── utils/                  # Calculator, validation, PDF, breakdown helpers
```

Full layout, visual flows, and deployment caveats: **[docs/index.html](docs/index.html)** · [ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Getting started

### Prerequisites

- Node.js **≥ 20** (CI and Netlify use **22**)

### Install & run

```bash
npm install
cp .env.example .env   # optional: add GEMINI_API_KEY for live AI locally
npm run dev            # http://localhost:3000 — Vite + Express
```

### Environment variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key — **server only**, never exposed to the browser |
| `APP_URL` | Public site URL for canonical / Open Graph meta at build time |

Production example:

```bash
APP_URL="https://carbonwisecoach.netlify.app"
npm run build
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (Express + Vite HMR) |
| `npm run build` | Production client + server bundle |
| `npm run start` | Serve `dist/` + `/api/*` (Node) |
| `npm run lint` | TypeScript check + ESLint (incl. jsx-a11y) |
| `npm run test` | Vitest unit & component tests |
| `npm run test:coverage` | Vitest with coverage thresholds |
| `npm run test:e2e` | Playwright smoke tests |

---

## Quality assurance

```bash
npm run lint
npm run test
npm run test:coverage
npm run test:e2e
```

**CI** (`.github/workflows/ci.yml`) on every push/PR to `main` / `master`:

1. Lint → coverage → build  
2. Playwright E2E (Chromium)

Coverage includes carbon math, recommendations, API validation, storage validation, onboarding, ErrorBoundary, and accessibility hooks.

---

## SEO & social sharing

- `index.html` — meta description, keywords, canonical, Open Graph, Twitter Card, JSON-LD
- `public/og-image.png` — 1200×630 preview image
- `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`
- `public/manifest.json`, `robots.txt`, `sitemap.xml`
- Build-time `__APP_URL__` replacement via `vite.config.ts` SEO plugin

On **Netlify**, set `APP_URL` under **Site settings → Environment variables** and redeploy.

---

## Deployment

### Netlify (current production)

Configured in `netlify.toml`:

- Build: `npm run build` → publish `dist/`
- SPA fallback (`/*` → `index.html`)
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, etc.)

**Important:** Netlify serves the static SPA only. Express `/api/*` routes do **not** run on a plain static deploy. Smart Coach uses the client-side rules engine unless you add Netlify Functions or host the Node server separately. `GEMINI_API_KEY` in Netlify env only enables AI if server code is wired to run.

### Full-stack Node

```bash
npm run build && npm run start
```

Serves the built app and Gemini API routes on the same origin (default port 3000).

---

## Security

- API keys server-side only (`GEMINI_API_KEY`)
- Helmet security headers + CSP in production
- `express-rate-limit` on AI endpoints (60 req / 15 min)
- Zod validation on all `/api/*` POST bodies and AI responses
- Chat history truncated to last 20 messages (client + server)
- Request body size capped at 32 KB
- User data in browser `localStorage` only — no server-side user database

---

## Contributing & contact

**Project architect:** Somesh Bhardwaj  
- Email: [hello@someshbhardwaj.dev](mailto:hello@someshbhardwaj.dev)  
- Portfolio: [someshbhardwaj.dev](https://someshbhardwaj.dev)  
- GitHub: [Dev-Somesh](https://github.com/Dev-Somesh)  
- LinkedIn: [@ersomeshbhardwaj](https://www.linkedin.com/in/ersomeshbhardwaj/)

**Client authorization:** itdeveloper06@gmail.com

---

> Calculations align with IPCC AR6, IEA 2023, and EPA greenhouse gas equivalencies where cited in-app. Methodology is available via the **Methodology** button on the dashboard.
