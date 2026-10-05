#!/bin/bash
# Round 2: unsubscribe + erasure + audit-trail verification
set -u
BASE="http://localhost:3000"
AUTH="Authorization: Bearer test-admin-123"
J="Content-Type: application/json"
NOW=$(($(date +%s%3N)-5000))

echo "=== 1. Signup Amelia ==="
# warm up route compilation (OPTIONS has no side effects)
curl -s -o /dev/null -X OPTIONS --max-time 60 "$BASE/api/waitlist"
RESP=$(curl -s --retry 3 --max-time 60 -X POST "$BASE/api/waitlist" -H "$J" \
  -d '{"name":"Amelia Clarke","email":"amelia@example.com","tierInterest":"plus","formStartedAt":'"$NOW"'}')
CONFIRM_URL=$(node -e "console.log(JSON.parse(process.argv[1]).demo.confirmUrl)" "$RESP" 2>/dev/null)
echo "confirm: $CONFIRM_URL"

echo "=== 2. Extract unsubscribe link from email HTML ==="
UNSUB_URL=$(node -e "
const r = JSON.parse(process.argv[1]);
const m = r.demo.emailHtml.match(/https?:\/\/[^\"']+unsubscribe\?[^\"']+/);
console.log(m ? m[0].replace(/&amp;/g, '&') : 'MISSING');" "$RESP")
echo "unsub: $UNSUB_URL"

echo "=== 3. Confirm ==="
curl -s -o /dev/null -w "→ %{http_code} → %{redirect_url}\n" "$CONFIRM_URL"

echo "=== 4. One-click unsubscribe ==="
curl -s -o /dev/null -w "→ %{http_code} → %{redirect_url}\n" "$UNSUB_URL"

echo "=== 5. Resubscribe → should be accepted as new consent ==="
curl -s -X POST "$BASE/api/waitlist" -H "$J" \
  -d '{"name":"Amelia Clarke","email":"amelia@example.com","tierInterest":"essential","formStartedAt":'$(($(date +%s%3N)-5000))'}' | head -c 100; echo

echo "=== 6. Signup Oliver ==="
curl -s -X POST "$BASE/api/waitlist" -H "$J" \
  -d '{"name":"Oliver Smith","email":"oliver@example.com","formStartedAt":'$(($(date +%s%3N)-5000))'}' | head -c 80; echo

echo "=== 7. Erase Oliver (Art. 17) ==="
curl -s -X POST -H "$AUTH" -H "$J" -d '{"email":"oliver@example.com"}' "$BASE/api/admin/delete"; echo

echo "=== 8. Final CSV ==="
curl -s -H "$AUTH" "$BASE/api/admin/export"

echo "=== 9. Consent log audit trail (from PostgreSQL) ==="
cat > /tmp/dump-log.mjs << 'EOF'
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
EOF
bun /tmp/dump-log.mjs 2>/dev/null || node scripts/dump-consent-log.mjs
