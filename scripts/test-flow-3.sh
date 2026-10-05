#!/bin/bash
# Round 4: verbose, node-based JSON extraction
set -u
BASE="http://localhost:3000"
AUTH="Authorization: Bearer test-admin-123"
J="Content-Type: application/json"
NOW=$(($(date +%s%3N)-5000))
export DATABASE_URL="postgresql://postgres@127.0.0.1:5433/lyria"

echo "=== 1. Signup Amelia (verbose) ==="
curl -s --retry 3 --max-time 60 -X POST "$BASE/api/waitlist" -H "$J" \
  -d '{"name":"Amelia Clarke","email":"amelia@example.com","tierInterest":"plus","formStartedAt":'"$NOW"'}' > /tmp/resp.json
head -c 150 /tmp/resp.json; echo

node -e '
const r = JSON.parse(require("fs").readFileSync("/tmp/resp.json", "utf8"));
if (!r.demo) { console.error("NO DEMO OBJ — keys:", Object.keys(r)); process.exit(1); }
const html = r.demo.emailHtml;
const c = html.match(/https?:\/\/[^"\\]+confirm\?token=[a-f0-9-]+/);
const u = html.match(/https?:\/\/[^"\\]+unsubscribe\?token=[a-f0-9-]+/);
require("fs").writeFileSync("/tmp/urls.txt", (c?.[0] ?? "CONFIRM_MISSING") + "\n" + (u?.[0] ?? "UNSUB_MISSING") + "\n");
'
CONFIRM_URL=$(sed -n 1p /tmp/urls.txt)
UNSUB_URL=$(sed -n 2p /tmp/urls.txt)
echo "confirm: $CONFIRM_URL"
echo "unsub:   $UNSUB_URL"

echo "=== 2. Confirm ==="
curl -s -o /dev/null -w "→ %{http_code} → %{redirect_url}\n" "$CONFIRM_URL"

echo "=== 3. Unsubscribe ==="
curl -s -o /dev/null -w "→ %{http_code} → %{redirect_url}\n" "$UNSUB_URL"

echo "=== 4. Resubscribe → expect PENDING + RESUBSCRIBED log ==="
curl -s -X POST "$BASE/api/waitlist" -H "$J" \
  -d '{"name":"Amelia Clarke","email":"amelia@example.com","tierInterest":"essential","formStartedAt":'$(($(date +%s%3N)-5000))'}' | head -c 60; echo

echo "=== 5. Consent log audit trail ==="
node scripts/dump-consent-log.mjs
