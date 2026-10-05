#!/bin/bash
# End-to-end verification of the Lyria waiting-list flow against PostgreSQL
set -u
BASE="http://localhost:3000"
AUTH="Authorization: Bearer test-admin-123"
J="Content-Type: application/json"

echo "=== 1. Valid signup (demo mode → email preview + confirm link) ==="
RESP=$(curl -s -X POST "$BASE/api/waitlist" -H "$J" \
  -d '{"name":"Amelia Clarke","email":"amelia@example.com","tierInterest":"plus","formStartedAt":'$(($(date +%s%3N)-5000))'}')
echo "$RESP" | head -c 400; echo

CONFIRM_URL=$(echo "$RESP" | grep -o 'http://[^"]*confirm[^"]*' | head -1)
UNSUB_URL=$(echo "$RESP" | grep -o 'http://[^"]*unsubscribe[^"]*' | head -1)
echo "confirm URL: ${CONFIRM_URL:-MISSING}"

echo "=== 2. Double opt-in confirm ==="
curl -s -o /dev/null -w "→ HTTP %{http_code} redirect=%{redirect_url}\n" "$CONFIRM_URL"

echo "=== 3. Duplicate (already confirmed) → friendly no-op ==="
curl -s -X POST "$BASE/api/waitlist" -H "$J" \
  -d '{"name":"Amelia Clarke","email":"amelia@example.com","tierInterest":"plus","formStartedAt":'$(($(date +%s%3N)-5000))'}' | head -c 200; echo

echo "=== 4. Honeypot bot → silent success, NOT stored ==="
curl -s -X POST "$BASE/api/waitlist" -H "$J" \
  -d '{"name":"Bot","email":"bot@spam.com","website":"http://spam","formStartedAt":1}' | head -c 120; echo

echo "=== 5. Disposable domain → rejected ==="
curl -s -X POST "$BASE/api/waitlist" -H "$J" \
  -d '{"name":"Tmp","email":"x@mailinator.com","formStartedAt":'$(($(date +%s%3N)-5000))'}' | head -c 120; echo

echo "=== 6. Unsubscribe ==="
curl -s -o /dev/null -w "→ HTTP %{http_code} redirect=%{redirect_url}\n" "$UNSUB_URL"

echo "=== 7. Resubscribe after unsubscribing → RESUBSCRIBED ==="
curl -s -X POST "$BASE/api/waitlist" -H "$J" \
  -d '{"name":"Amelia Clarke","email":"amelia@example.com","tierInterest":"essential","formStartedAt":'$(($(date +%s%3N)-5000))'}' | head -c 150; echo

echo "=== 8. Second real subscriber ==="
curl -s -X POST "$BASE/api/waitlist" -H "$J" \
  -d '{"name":"Oliver Smith","email":"oliver@example.com","formStartedAt":'$(($(date +%s%3N)-5000))'}' | head -c 120; echo

echo "=== 9. CSV export (admin) ==="
curl -s -H "$AUTH" "$BASE/api/admin/export"; echo

echo "=== 10. CSV export without token → 401 ==="
curl -s -o /dev/null -w "→ HTTP %{http_code}\n" "$BASE/api/admin/export"

echo "=== 11. Erasure on request (Art. 17) ==="
curl -s -X POST -H "$AUTH" -H "$J" -d '{"email":"oliver@example.com"}' "$BASE/api/admin/delete"; echo

echo "=== 12. CSV after erasure (row gone, tombstone remains in log) ==="
curl -s -H "$AUTH" "$BASE/api/admin/export"; echo
