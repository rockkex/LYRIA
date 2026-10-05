import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function authorised(req: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false; // no token configured → admin surface disabled
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${expected}`;
}

function csvEscape(value: string | null | undefined | Date): string {
  if (value === null || value === undefined) return "";
  const s = value instanceof Date ? value.toISOString() : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

/**
 * GET /api/admin/export
 * Authorization: Bearer <ADMIN_TOKEN>
 *
 * CSV export of the waiting list — the client's stated need for
 * "CSV export" and the practical route to their inbox provider.
 */
export async function GET(req: Request) {
  if (!authorised(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  const subscribers = await db.subscriber.findMany({
    orderBy: { createdAt: "asc" },
  });

  const header = [
    "id", "name", "email", "tier_interest", "status",
    "source", "signed_up_at", "confirmed_at", "unsubscribed_at",
  ].join(",");

  const rows = subscribers
    .map((s) =>
      [
        s.id, s.name, s.email, s.tierInterest, s.status,
        s.source, s.createdAt, s.confirmedAt, s.unsubscribedAt,
      ]
        .map(csvEscape)
        .join(",")
    )
    .join("\n");

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(`${header}\n${rows}\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lyria-waitlist-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
