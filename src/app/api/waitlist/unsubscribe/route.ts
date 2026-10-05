import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activeConsent } from "@/lib/consent";
import { clientIp, hashWithSalt } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function baseUrl(req: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  const h = req.headers;
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("host") ?? "lyriahealth.co.uk";
  return `${proto}://${host}`;
}

async function doUnsubscribe(token: string | null, req: Request) {
  const origin = baseUrl(req);
  if (!token) {
    return NextResponse.redirect(`${origin}/?state=error&reason=missing_token`);
  }

  try {
    const subscriber = await db.subscriber.findUnique({
      where: { unsubToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(
        `${origin}/?state=error&reason=invalid_token`
      );
    }

    if (subscriber.status !== "UNSUBSCRIBED") {
      await db.subscriber.update({
        where: { id: subscriber.id },
        data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
      });

      const consent = activeConsent();
      await db.consentLog.create({
        data: {
          subscriberId: subscriber.id,
          event: "UNSUBSCRIBED",
          wordingVersion: consent.version,
          wordingText: consent.text,
          source: subscriber.source,
          ipHash: await hashWithSalt(clientIp(req)),
          userAgent: (req.headers.get("user-agent") ?? "").slice(0, 300),
        },
      });
    }

    // PECR: unsubscribing must always end in success for the user,
    // even if the token was already used (idempotent, never an error page).
    return NextResponse.redirect(`${origin}/?state=unsubscribed`);
  } catch (err) {
    console.error("[waitlist] unsubscribe failed:", err);
    return NextResponse.redirect(`${origin}/?state=error&reason=server`);
  }
}

/**
 * GET — one-click unsubscribe link from any email.
 * (PECR requires this to be effortless and honoured promptly.)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  return doUnsubscribe(searchParams.get("token"), req);
}

/**
 * POST — RFC 8058 "List-Unsubscribe-Post: One-Click" endpoint.
 * Mail clients (Gmail, Apple Mail) can unsubscribe the user
 * directly without opening the site at all.
 */
export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  let token: string | null = null;

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await req.formData();
    token = form.get("token") as string | null;
  } else {
    const { searchParams } = new URL(req.url);
    token = searchParams.get("token");
  }

  return doUnsubscribe(token, req);
}
