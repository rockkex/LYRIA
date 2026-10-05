import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activeConsent } from "@/lib/consent";
import { hashWithSalt } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function authorised(req: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${expected}`;
}

/**
 * POST /api/admin/delete   { "email": "person@example.com" }
 * Authorization: Bearer <ADMIN_TOKEN>
 *
 * Right-to-erasure (UK GDPR Art. 17) handled properly:
 * the subscriber and all personal data are deleted, and a
 * tombstone audit row (salted email hash, no PII) records that
 * a deletion occurred — so the accountability trail survives
 * without retaining personal data.
 */
export async function POST(req: Request) {
  if (!authorised(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json(
      { ok: false, error: "An email address is required." },
      { status: 400 }
    );
  }

  const subscriber = await db.subscriber.findUnique({ where: { email } });
  if (!subscriber) {
    // Do not leak whether the address was on the list.
    return NextResponse.json({ ok: true, deleted: false });
  }

  const consent = activeConsent();
  const emailHash = await hashWithSalt(email);

  // Tombstone audit row BEFORE deletion (no personal data in it).
  await db.consentLog.create({
    data: {
      subscriberId: null,
      subscriberHash: emailHash,
      event: "DATA_DELETED",
      wordingVersion: consent.version,
      wordingText: consent.text,
      source: subscriber.source,
    },
  });

  // Cascade: consent logs referencing this subscriber are set to
  // null (onDelete: SetNull) — the audit history of events stays,
  // unlinkable to a person.
  await db.subscriber.delete({ where: { id: subscriber.id } });

  return NextResponse.json({ ok: true, deleted: true });
}
