/**
 * Verify the consent audit trail end-to-end:
 * - subscriber status transitions
 * - consent log rows (wording version + text + source)
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const subs = await db.subscriber.findMany({
    include: { consentLogs: true },
  });

  console.log("=== SUBSCRIBERS ===");
  for (const s of subs) {
    console.log({
      email: s.email,
      name: s.name,
      tier: s.tierInterest,
      status: s.status,
      source: s.source,
      confirmedAt: s.confirmedAt,
    });
    console.log("  consent log:");
    for (const l of s.consentLogs) {
      console.log(`   • ${l.event} | v${l.wordingVersion} | source=${l.source} | ipHash=${l.ipHash?.slice(0, 12)}…`);
      console.log(`     wording: "${l.wordingText.slice(0, 80)}…"`);
    }
  }

  console.log("\n=== LOG EVENT COUNTS ===");
  const counts = await db.consentLog.groupBy({ by: ["event"], _count: true });
  console.log(counts.map((c) => `${c.event}: ${c._count}`).join(" | "));

  // Print the unsubscribe token for the browser test
  const alex = subs.find((s) => s.email === "alex.morgan@example.co.uk");
  if (alex) console.log(`\nUNSUB_TOKEN=${alex.unsubToken}`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
