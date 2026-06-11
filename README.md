# CarbonWise Coach — Sustainable Climate Assistant

CarbonWise Coach is a high-fidelity, client-side personal sustainability hub and climate coaching application. It is designed to evaluate individual annual greenhouse outputs, suggest micro-targeted greener habits, and keep users actively engaged via real-time challenges, comparative benchmarking, and smart AI consulting.

---

## Key Core Features

### 1. Dynamic Carbon Footprint Assessment
Meticulously calculates baseline green house gas outputs (in kg CO2e) across 4 high-impact behavioral sectors:
* **Transportation & Commute**: Quantifies short/long-distance flights, commuting distance, and fuel choices.
* **Diet & Agriculture**: Gauges meat consumption frequency, sourcing practices, and food wastage parameters.
* **Home Utilities**: Pinpoints electrical usage based on home sizes, electrical appliance counts, and green energy contracts.
* **Shopping & Consumer Waste**: Audits garment updates, consumer tech lifecycles, and recycling commitments.

### 2. Interactive Historical Trend Analytics
* Features high-resolution, responsive trend lines mapped dynamically by **Recharts**.
* Tracks multi-session logging arrays to trace emission improvements chronologically.

### 3. "What-If" Dynamic Carbon Sandbox Simulator
* Lets you run real-time hypothetical experimentation by moving sliders to test "what-if" lifestyle shifts (e.g. going vegetarian or swapping standard fuel for public transit) without resetting original profile variables.

### 4. Milestones, Badges, and Trophy achievements
* Dynamic achievements engine tracking positive climate milestones.
* Unlocks prestigious badges like "Carbon Neutral Newbie", "Eco Champion", and "Zero-Waste Warrior" to gamify green habit loops.

### 5. Interactive Weekly Action Challenges
* Direct checkouts for targeted weekly wins (e.g., active transport commuting, cold wash cycles, plant-forward trials) that immediately deduct calculated emissions from your overall footprint metrics.

### 6. Audit-Grade PDF Journey Summary Reports
* High-performance, client-side multi-page PDF generation via **jsPDF**.
* Includes elegant executive visual stats grids, detailed category charts, horizontal benchmarking timelines, and micro-targeted custom coaching advice contracts.

### 7. AI-Powered Smart Coaching Consultation
* Interactive chat interface utilizing the modern `@google/genai` TypeScript SDK (utilizing the model `models/gemini-2.5-flash` or `models/gemini-3.5-flash`).
* Synthesizes tailored climate mitigation tactics, answers complex ecological questions, and creates conversational habit roadmaps.

---

## Technical Architecture

* **Frontend Framework**: React 19 with Vite
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Data Visualizations**: Recharts
* **PDF Report Generation**: jsPDF
* **AI Engine**: `@google/genai` Node client library

---

## Running Locally

```bash
# Install package dependencies
npm install

# Copy environment template and add your Gemini API key (optional — app falls back to rules engine)
cp .env.example .env

# Start local dev server (port 3000)
npm run dev

# Compile full-stack distribution build
npm run build

# Start production server
npm run start
```

## Quality Assurance

```bash
# TypeScript type-check
npm run lint

# Run unit tests (Vitest)
npm run test

# Run tests with coverage report
npm run test:coverage
```

Test coverage includes carbon calculator math, recommendation engine sorting, and API input validation schemas.

## Security

* API keys (`GEMINI_API_KEY`) are server-side only — never exposed to the browser
* Express `helmet` security headers and `express-rate-limit` on AI endpoints (60 req / 15 min)
* Zod schema validation on all `/api/*` POST payloads
* Request body size capped at 32 KB
* User data stored locally in browser `localStorage` (privacy-first, no server persistence)

---

## Project Collaboration & Authorization

This project is actively curated and authorized:

* **Project Architect**: **Somesh Bhardwaj** (Project Architect & Full-stack Engineer)  
  * *Email*: [hello@someshbhardwaj.dev](mailto:hello@someshbhardwaj.dev)  
  * *Portfolio*: [someshbhardwaj.dev](https://someshbhardwaj.dev)  
  * *Git*: [Dev-Somesh](http://github.com/Dev-Somesh)  
  * *LinkedIn*: [@ersomeshbhardwaj](https://www.linkedin.com/in/ersomeshbhardwaj/)  

* **Client Authorization**: **itdeveloper06@gmail.com** (Authorized Client & Project Stakeholder)

---

> *Note: This application operates primarily with high-performance local storage persistence. All carbon audit calculations align with standard IPCC AR6, IEA 2023, and EPA Greenhouse Equivalencies matrices.*
