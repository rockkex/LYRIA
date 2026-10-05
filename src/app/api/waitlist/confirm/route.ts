import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activeConsent } from "@/lib/consent";
import { clientIp, hashWithSalt } from "@/lib/rate-limit";
import { emailConfigured, sendWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function baseUrl(req: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  const h = req.headers;
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("host") ?? "lyriahealth.co.uk";
  return `${proto}://${host}`;
}

/**
 * GET — the link inside the confirmation email.
 * Verifies the token, flips PENDING → CONFIRMED (the actual
 * "double opt-in"), writes an audit row, sends the welcome
 * email, then redirects the person back to the landing page
 * with a visible confirmation state.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const origin = baseUrl(req);

  if (!token) {
    return NextResponse.redirect(`${origin}/?state=error&reason=missing_token`);
  }

  try {
    const subscriber = await db.subscriber.findUnique({
      where: { confirmToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(
        `${origin}/?state=error&reason=invalid_token`
      );
    }

    if (subscriber.status === "CONFIRMED") {
      // Idempotent: clicking a stale link still lands on a friendly page.
      return NextResponse.redirect(`${origin}/?state=confirmed`);
    }

    if (subscriber.status === "UNSUBSCRIBED") {
      return NextResponse.redirect(
        `${origin}/?state=error&reason=unsubscribed`
      );
    }

    await db.subscriber.update({
      where: { id: subscriber.id },
      data: { status: "CONFIRMED", confirmedAt: new Date() },
    });

    const consent = activeConsent();
    await db.consentLog.create({
      data: {
        subscriberId: subscriber.id,
        event: "DOUBLE_OPT_IN_CONFIRMED",
        wordingVersion: consent.version,
        wordingText: consent.text,
        source: subscriber.source,
        ipHash: await hashWithSalt(clientIp(req)),
        userAgent: (req.headers.get("user-agent") ?? "").slice(0, 300),
      },
    });

    await sendWelcomeEmail({
      to: subscriber.email,
      name: subscriber.name,
      unsubscribeUrl: `${origin}/api/waitlist/unsubscribe?token=${subscriber.unsubToken}`,
    });

    return NextResponse.redirect(`${origin}/?state=confirmed`);
  } catch (err) {
    console.error("[waitlist] confirm failed:", err);
    return NextResponse.redirect(`${origin}/?state=error&reason=server`);
  }
}
