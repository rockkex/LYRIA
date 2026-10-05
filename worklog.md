# Worklog

---
Task ID: 1
Agent: Main agent (Super Z)
Task: Build Lyria Health landing page with GDPR-compliant waiting list (double opt-in) as live Upwork proposal demo

Work Log:
- Loaded fullstack-dev skill, initialized Next.js 16 project environment
- Researched algorx.com (client's design reference): dark editorial header, mono uppercase eyebrow labels, hover-underline nav, hairline rules
- Discovered client's existing draft site at lyriahealth.co.uk: extracted their verbatim copy, brand palette (ink #1B2C47, paper #F4F0E8, gold #A9823D), Fraunces + Work Sans fonts
- Designed Prisma schema: Subscriber (PENDING/CONFIRMED/UNSUBSCRIBED lifecycle) + append-only ConsentLog (wording version + exact text + source + salted IP hash + tombstones)
- Built design system in globals.css: Tailwind 4 tokens, scroll-reveal, contour motif, pulse-dot, drift glow, reduced-motion support
- Built layout with next/font (Fraunces/Work Sans/IBM Plex Mono), SEO + OG metadata for lyriahealth.co.uk
- All copy centralized in src/content/site.ts (client verbatim + draft how-it-works/FAQ marked for replacement); consent wording versioned in src/lib/consent.ts
- Backend: POST /api/waitlist (Zod validation, honeypot, time-trap, rate limit 5/min/IP, disposable blocklist, consent logging, Resend email via REST with demo-mode fallback returning email HTML), GET confirm + unsubscribe routes (redirect back with ?state=), RFC 8058 one-click POST unsubscribe, admin CSV export + erasure endpoints (Bearer ADMIN_TOKEN, tombstone audit rows)
- Frontend: announcement bar, sticky nav, dark hero with cream form card, NHS-vs-Lyria stat band, how-it-works, pull quote, 3 tier cards (Plus featured), doctor section, FAQ accordion, final CTA + footer; privacy notice sheet with full UK GDPR notice; email-preview dialog rendering exact email HTML for live double opt-in demo; status banners for confirmed/unsubscribed/error states
- Verified with agent-browser: desktop + mobile rendering, full flow (submit → success panel → email preview → confirm API → ?state=confirmed banner → unsubscribe → ?state=unsubscribed), DB audit trail (SIGNUP_CONSENT → DOUBLE_OPT_IN_CONFIRMED → UNSUBSCRIBED → RESUBSCRIBED all logged with version/source/ipHash), honeypot silent-success fix, rate limit 429 on 6th request, CSV export content, erasure 401/no-leak behavior, footer privacy sheet trigger
- Reset DB to pristine demo state; zero runtime errors in dev.log; ESLint clean

Stage Summary:
- Deliverable: production-ready Next.js 16 waiting-list site at / (single route by design) + 4 API routes, Prisma SQLite, README.md with Vercel/Resend/DNS deployment guide and GDPR implementation answers for the Upwork proposal
- Key decisions: single-page architecture (?state= redirect targets) for preview simplicity; Resend via REST (no SDK weight); demo-mode email preview so the client can walk double opt-in live without an email key; copy isolated in one file for exact-as-supplied replacement

---
Task ID: 2
Agent: Main agent (Super Z)
Task: Make the project Vercel-deployable; answer "how do I deploy it on Vercel"

Work Log:
- Identified blocker: SQLite cannot persist on Vercel serverless FS → switched Prisma datasource sqlite → postgresql (schema fields all provider-agnostic; zero app-code change)
- Installed portable PostgreSQL 16 (zonky binaries, no sudo) at scripts/pg/ (gitignored) running on 127.0.0.1:5433/lyria
- package.json: build → plain `next build` (Vercel; standalone copy kept as build:standalone); added postinstall `prisma generate`; dev + db:* scripts now source optional `.env.startup` (sandbox-only, gitignored) to defeat the sandbox's global SQLite DATABASE_URL that overrides .env
- db.ts: Prisma query logging now dev-only
- E2E-verified on real PostgreSQL (5 rounds): signup → SIGNUP_CONSENT → double opt-in confirm (307 → ?state=confirmed) → unsubscribe (307 → ?state=unsubscribed) → RESUBSCRIBED → CSV export → erasure with tombstone (DATA_DELETED, subscriberHash survives) → RFC 8058 form-encoded POST one-click unsubscribe → honeypot/disposable silent-success (not stored) → rate limit 429 on 6th/min
- Wiped DB back to pristine after tests
- `bun run build` verified clean (all API routes dynamic, shell compiles)
- Git hygiene: untracked .env (was scaffold-tracked), excluded scripts/pg binaries, added .env.example + !.env.example gitignore exception; committed as "Vercel-ready: PostgreSQL provider, deploy guide, sandbox env handling" (ee56db7)
- README section 5 rewritten click-by-click: GitHub push → vercel.com/new import → env vars → Storage → Postgres (Neon) 1-click DB → prisma db push → Resend + DNS records → domain attachment; plus vercel CLI alternative and post-deploy sanity checklist
- Packaged clean source: download/lyria-health-waitlist-source.zip (git archive, 160 files, no secrets/node_modules)

Stage Summary:
- Project is now Vercel-ready: user pushes to GitHub → imports at vercel.com/new → creates Vercel Postgres (Neon) in Storage tab → runs one `prisma db push` → live
- Dev server left running for preview; local test DB: scripts/pg (port 5433, db "lyria")
- Note for future sessions: sandbox global DATABASE_URL=file:… overrides .env; .env.startup sourcing in dev/db scripts handles it — do not remove
