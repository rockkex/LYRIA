# Lyria Health — Waiting List

A premium, minimal landing page with a fully working, GDPR/PECR-compliant waiting list (double opt-in) for **lyriahealth.co.uk**.

Design language: deep navy ink (`#1B2C47`), warm paper (`#F4F0E8`), gold accent (`#A9823D`), Fraunces + Work Sans + IBM Plex Mono — inspired by the client's algorx.com reference (dark editorial header, mono eyebrow labels, one clear call to action) while preserving the client's existing brand palette and copy verbatim.

---

## 1 · Quick start

```bash
bun install
bun run db:push     # create SQLite tables
bun run dev         # http://localhost:3000
```

`.env` values:

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | SQLite file (Prisma) |
| `ADMIN_TOKEN` | recommended | Bearer token for CSV export / erasure endpoints |
| `IP_HASH_SALT` | recommended | Salt used to hash IPs in the consent log (raw IPs are never stored) |
| `RESEND_API_KEY` | optional | When absent the app runs in **demo mode**: emails are not sent; the API returns the exact email HTML + a live confirm link so the whole double opt-in journey can be walked in the browser |
| `CONFIRM_EMAIL_FROM` | optional | e.g. `Lyria <hello@lyriahealth.co.uk>` |
| `NEXT_PUBLIC_APP_URL` | optional | Override for email link base URL (defaults to request origin) |

## 2 · The double opt-in flow (how it works)

```
Visitor submits form (name, email, tier — nothing else)
        │
        ▼
POST /api/waitlist
  ├─ Zod validation (schema = data-minimisation guarantee)
  ├─ Honeypot + time-trap → silent success for bots (never revealed)
  ├─ In-memory rate limit: 5 submissions/min/IP → 429
  ├─ Disposable-domain blocklist
  ├─ Subscriber created as PENDING (or refreshed if re-subscribing)
  ├─ ConsentLog row: SIGNUP_CONSENT
  │    • wording version + EXACT wording shown
  │    • source (hero / footer), timestamp
  │    • salted IP hash, user agent
  └─ Confirmation email with unique token link
        │
        ▼
GET /api/waitlist/confirm?token=…
  ├─ PENDING → CONFIRMED  (this is the actual double opt-in)
  ├─ ConsentLog row: DOUBLE_OPT_IN_CONFIRMED
  ├─ Welcome email (with List-Unsubscribe headers, RFC 8058 one-click)
  └─ Redirect to /?state=confirmed  →  banner on the landing page
```

Unsubscribing: `GET /api/waitlist/unsubscribe?token=…` (link in every email) → `UNSUBSCRIBED` + audit row → redirect to `/?state=unsubscribed`. The route also accepts `POST` with `List-Unsubscribe-Post: One-Click` so Gmail/Apple Mail can unsubscribe the user directly from the mail client.

Duplicate handling: confirmed → friendly no-op; pending → tokens refreshed, email resent; unsubscribed → treated as a new consent (logged as `RESUBSCRIBED`).

## 3 · Consent log (accountability, UK GDPR Art. 7)

Every consent event writes an append-only `ConsentLog` row:

| Field | Notes |
|---|---|
| `event` | SIGNUP_CONSENT · DOUBLE_OPT_IN_CONFIRMED · UNSUBSCRIBED · RESUBSCRIBED · DATA_DELETED |
| `wordingVersion` | e.g. `v1.0` — defined in `src/lib/consent.ts` |
| `wordingText` | the exact sentence the person saw |
| `source` | `hero` / `footer` form |
| `ipHash` | salted SHA-256 — provable without storing raw IPs |
| `subscriberHash` | on DATA_DELETED tombstones only (survives erasure) |

**Changing wording:** never edit an old entry — add a new one in `src/lib/consent.ts` with `version: "v1.1"` and set `active: true`. Old records keep pointing at the wording that was actually shown.

## 4 · Admin surface (Bearer `ADMIN_TOKEN`)

```bash
# CSV export of the whole list
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://lyriahealth.co.uk/api/admin/export -o waitlist.csv

# Erasure on request (Art. 17) — deletes person, keeps tombstone audit row
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"person@example.com"}' \
  https://lyriahealth.co.uk/api/admin/delete
```

## 5 · Deploy to Vercel + connect email

1. **Repo → Vercel**: import, framework preset Next.js. Use a real database for production (Vercel Postgres / Neon / Turso) — swap the Prisma `datasource` provider; the schema is unchanged.
2. **Resend** (recommended): EU data residency, generous free tier, first-class API, handles SPF/DKIM tooling. Create the sending domain `lyriahealth.co.uk`, then set `RESEND_API_KEY` and `CONFIRM_EMAIL_FROM`.
3. **DNS records at the registrar** (exact values are shown in the Resend dashboard):
   - `TXT @` — `v=spf1 include:amazonses.com ~all` (SPF)
   - 3 × `TXT` under `resend._domainkey` / ` resend1._domainkey` … — DKIM keys from Resend
   - `TXT _dmarc` — `v=DMARC1; p=none; rua=mailto:hello@lyriahealth.co.uk` (tighten to `quarantine` once monitoring is clean)
   - `CNAME send.lyriahealth.co.uk` → Resend tracking domain (optional, open-rate tracking)
   - No MX changes needed — the domain only sends.
4. **Domain in Vercel**: add `lyriahealth.co.uk` + `www`, point the registrar's `A`/`CNAME` records at Vercel. SSL is automatic.
5. Once `RESEND_API_KEY` is set, demo mode disappears automatically — real emails are sent and the preview affordances vanish.

## 6 · Editing copy

All copy lives in **`src/content/site.ts`** — hero, steps, tiers, FAQ, footer legal. The client's final wording can replace the current text verbatim without touching a component. Consent wording + versioning live in `src/lib/consent.ts`.

Compliance guardrails baked into the content: "registering with the CQC" status badge, "planned/provisional" tier chips, no clinical claims, no payment language beyond "no payment taken".

## 7 · Performance & accessibility

- Single route, statically rendered shell; client JS limited to the form, FAQ accordion, sheet and dialogs
- Fonts self-hosted via `next/font` (no render-blocking Google Fonts request)
- Semantic landmarks, skip link, `aria-live` form status, labelled inputs, visible focus rings, `prefers-reduced-motion` honoured for all animation
- Colour pairs chosen for WCAG 2.2 AA contrast (gold is decorative or ≥3:1 large text; body text is ink-on-paper ≥ 7:1)
- Privacy-friendly analytics: **none bundled** — drop in Plausible/Umami script tag when ready (cookieless, no consent banner needed)

## 8 · Built for the next phases

- Referral sharing: `Subscriber` rows are stable, token-addressed entities — add a `referralCode` column + share endpoint without touching the consent machinery
- Booking/payments: the site never handles clinical data by design; consultations run on the separate clinical platform, so launch simply replaces the waitlist CTA with the booking URL
- Multi-area phasing: `tierInterest` + a future `areaCode` column slot into the existing schema

## 9 · Project structure

```
src/
  app/
    page.tsx                      # the landing page (single route by design)
    api/waitlist/route.ts         # POST signup (+ bot traps, rate limit, consent log)
    api/waitlist/confirm/route.ts # GET double opt-in → CONFIRMED
    api/waitlist/unsubscribe/route.ts # GET/POST one-click unsubscribe (RFC 8058)
    api/admin/export/route.ts     # CSV export
    api/admin/delete/route.ts     # erasure on request
  components/landing/             # sections, form, privacy sheet, email preview
  content/site.ts                 # ALL copy (client-editable)
  lib/consent.ts                  # versioned consent wording
  lib/email.ts                    # Resend templates + demo fallback
  lib/validation.ts               # Zod schema, bot checks, disposable blocklist
  lib/rate-limit.ts               # per-IP limiter + salted hashing
prisma/schema.prisma              # Subscriber + ConsentLog
```
