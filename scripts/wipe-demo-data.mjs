import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
const logs = await db.consentLog.deleteMany({});
const subs = await db.subscriber.deleteMany({});
console.log(`wiped ${logs.count} consent-log rows, ${subs.count} subscribers`);
await db.$disconnect();
