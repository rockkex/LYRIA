import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
const rows = await db.consentLog.findMany({
  orderBy: { createdAt: 'asc' },
  select: { event: true, wordingVersion: true, source: true, ipHash: true, subscriberHash: true, subscriberId: true, createdAt: true },
});
for (const r of rows) {
  console.log(
    r.createdAt.toISOString().slice(11, 19),
    r.event.padEnd(24),
    'v' + r.wordingVersion,
    r.source.padEnd(6),
    r.ipHash ? 'ip✓' : 'ip-',
    r.subscriberHash ? 'hash✓' : '',
  );
}
const subs = await db.subscriber.findMany({ select: { email: true, status: true, tierInterest: true } });
console.log('--- subscribers ---');
for (const s of subs) console.log(s.email.padEnd(24), s.status.padEnd(12), s.tierInterest ?? '-');
await db.$disconnect();
