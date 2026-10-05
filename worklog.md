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
