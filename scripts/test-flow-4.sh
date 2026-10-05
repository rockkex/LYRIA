#!/bin/bash
# Round 5: full lifecycle on a fresh subscriber + pristine cleanup
set -u
BASE="http://localhost:3000"
J="Content-Type: application/json"
AUTH="Authorization: Bearer test-admin-123"
export DATABASE_URL="postgresql://postgres@127.0.0.1:5433/lyria"

signup() {
  curl -s --retry 3 --max-time 60 -X POST "$BASE/api/waitlist" -H "$J" \
    -d '{"name":"Test Person","email":"test2@example.com","tierInterest":"premium","formStartedAt":'$(($(date +%s%3N)-5000))'}'
}

echo "=== 1. Signup test2@example.com ==="
signup > /tmp/resp.json
node -e '
const r = JSON.parse(require("fs").readFileSync("/tmp/resp.json", "utf8"));
const html = r.demo.emailHtml;
const c = html.match(/https?:\/\/[^"\\]+confirm\?token=[a-f0-9-]+/);
const u = html.match(/https?:\/\/[^"\\]+unsubscribe\?token=[a-f0-9-]+/);
require("fs").writeFileSync("/tmp/urls.txt", (c?.[0] ?? "CONFIRM_MISSING") + "\n" + (u?.[0] ?? "UNSUB_MISSING") + "\n");
console.log("status:", r.status);'
CONFIRM_URL=$(sed -n 1p /tmp/urls.txt)
UNSUB_URL=$(sed -n 2p /tmp/urls.txt)
echo "confirm: $CONFIRM_URL"
echo "unsub:   $UNSUB_URL"

echo "=== 2. Double opt-in confirm ==="
curl -s -o /dev/null -w "→ %{http_code} → %{redirect_url}\n" "$CONFIRM_URL"

echo "=== 3. One-click unsubscribe ==="
curl -s -o /dev/null -w "→ %{http_code} → %{redirect_url}\n" "$UNSUB_URL"

echo "=== 4. Resubscribe (new consent) ==="
signup | head -c 60; echo

echo "=== 5. Audit trail for test2 ==="
node scripts/dump-consent-log.mjs 2>&1 | rg "test2|RESUB|UNSUB|SIGNUP|DOUBLE|DATA_DEL|subscribers" | head -20

echo "=== 6. RFC 8058 one-click POST unsubscribe (mail-client style) ==="
TOKEN=$(echo "$UNSUB_URL" | sed 's/.*token=//')
curl -s -o /dev/null -w "→ %{http_code} → %{redirect_url}\n" -X POST "$BASE/api/waitlist/unsubscribe" -H "List-Unsubscribe-Post: One-Click" -H "$J" -d "token=$TOKEN"

echo "=== 7. PRISTINE CLEANUP: wipe all demo data ==="
cat > scripts/wipe-demo-data.mjs << 'EOF'
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
const logs = await db.consentLog.deleteMany({});
const subs = await db.subscriber.deleteMany({});
console.log(`wiped ${logs.count} consent-log rows, ${subs.count} subscribers`);
await db.$disconnect();
EOF
node scripts/wipe-demo-data.mjs
echo "=== 8. Final CSV (must be empty) ==="
curl -s -H "$AUTH" "$BASE/api/admin/export"; echo "[end]"
