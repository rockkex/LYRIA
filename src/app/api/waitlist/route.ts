import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activeConsent } from "@/lib/consent";
import { waitlistSchema, isDisposableEmail, isLikelyBot } from "@/lib/validation";
import { rateLimit, clientIp, hashWithSalt } from "@/lib/rate-limit";
import { emailConfigured, sendConfirmationEmail, confirmationEmailHtml } from "@/lib/email";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

/** Absolute base URL for email links (works on Vercel + preview proxies). */
function baseUrl(req: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  const h = req.headers;
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("host") ?? "lyriahealth.co.uk";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  // 1 ── Rate limit (per IP)
  const ip = clientIp(req);
  const rl = rateLimit(`waitlist:${ip}`);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  // 2 ── Validate payload (schema = data minimisation guarantee)
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    const msg =
      parsed.error.issues[0]?.message ?? "Please check the form and try again.";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  const data = parsed.data;

  // 3 ── Bot checks → silent success (never reveal the trap)
  if (isLikelyBot(data) || isDisposableEmail(data.email)) {
    return NextResponse.json({ ok: true, status: "PENDING" });
  }

  const consent = activeConsent();
  const userAgent = (req.headers.get("user-agent") ?? "").slice(0, 300);
  const ipHash = await hashWithSalt(ip);
  const origin = baseUrl(req);
  const unsubUrl = (token: string) =>
    `${origin}/api/waitlist/unsubscribe?token=${token}`;
  const source = req.headers.get("x-lyria-source") ?? "hero";

  // 4 ── Upsert subscriber + append-only consent audit trail
  try {
    const existing = await db.subscriber.findUnique({
      where: { email: data.email },
    });

    const confirmToken = randomUUID();
    const unsubToken = randomUUID();
    const confirmUrl = `${origin}/api/waitlist/confirm?token=${confirmToken}`;

    if (existing?.status === "CONFIRMED") {
      // Already a confirmed member — nothing to do, never re-send.
      return NextResponse.json({ ok: true, status: "CONFIRMED" });
    }

    if (existing) {
      // PENDING → refresh details + tokens, resend the link.
      // UNSUBSCRIBED → explicit re-subscription: they consented again.
      await db.subscriber.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          tierInterest: data.tierInterest,
          status: "PENDING",
          confirmToken,
          unsubToken,
          unsubscribedAt: null,
          source,
        },
      });
      await db.consentLog.create({
        data: {
          subscriberId: existing.id,
          event:
            existing.status === "UNSUBSCRIBED" ? "RESUBSCRIBED" : "SIGNUP_CONSENT",
          wordingVersion: consent.version,
          wordingText: consent.text,
          source,
          ipHash,
          userAgent,
        },
      });
    } else {
      const subscriber = await db.subscriber.create({
        data: {
          email: data.email,
          name: data.name,
          tierInterest: data.tierInterest,
          status: "PENDING",
          confirmToken,
          unsubToken,
          source,
        },
      });

      await db.consentLog.create({
        data: {
          subscriberId: subscriber.id,
          event: "SIGNUP_CONSENT",
          wordingVersion: consent.version,
          wordingText: consent.text,
          source,
          ipHash,
          userAgent,
        },
      });
    }

    const sent = await sendConfirmationEmail({
      to: data.email,
      name: data.name,
      confirmUrl,
      unsubscribeUrl: unsubUrl(unsubToken),
    });

    return NextResponse.json({
      ok: true,
      status: "PENDING",
      emailSent: sent,
      // Demo mode: expose the live confirmation link AND the exact
      // email HTML, so the full double opt-in journey can be walked
      // in the browser without an email provider configured.
      ...(emailConfigured()
        ? {}
        : {
            demo: {
              confirmUrl,
              emailHtml: confirmationEmailHtml(
                data.name,
                confirmUrl,
                unsubUrl(unsubToken)
              ),
            },
          }),
    });
  } catch (err) {
    console.error("[waitlist] signup failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our side. Please try again." },
      { status: 500 }
    );
  }
}
