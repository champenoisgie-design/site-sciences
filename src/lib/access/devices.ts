// @ts-nocheck
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { withMeta } from "@/lib/prisma-safe";

function h(s: string) { return crypto.createHash("sha256").update(s).digest("hex").slice(0, 16); }

export async function recordDevice(userId: string, ua: string, ip?: string) {
  const uaHash = h(ua||"");
  const ipHash = h((ip||"").split(".").slice(0,2).join(".")); // coarse
  const existing = await prisma.userDevice.findFirst({ where: { userId, uaHash, ipHash } });
  if (existing) {
    return prisma.userDevice.update({ where: { id: existing.id }, data: { lastSeen: new Date(), updatedAt: new Date() } });
  }
  return prisma.userDevice.create({ data: withMeta({ userId, uaHash, ipHash }, "dev") });
}

export async function tooManyDevices(userId: string, windowDays = 30, limit = 4) {
  const since = new Date(Date.now() - windowDays*24*3600*1000);
  const cnt = await prisma.userDevice.count({ where: { userId, lastSeen: { gte: since } }});
  return cnt > limit;
}