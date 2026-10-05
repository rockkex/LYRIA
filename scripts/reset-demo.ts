/** Reset the waiting list to a pristine demo state (removes test data). */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const removed = await db.consentLog.deleteMany({});
  const removedSubs = await db.subscriber.deleteMany({});
  console.log(`Removed ${removedSubs.count} subscribers and ${removed.count} consent log rows. Demo state is pristine.`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
