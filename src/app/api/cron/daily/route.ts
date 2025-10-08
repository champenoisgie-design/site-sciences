// src/app/api/cron/daily/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sodUTC(d = new Date()) { return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); }
function addDays(d: Date, n: number) { const x = new Date(d); x.setUTCDate(x.getUTCDate()+n); return x; }

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const secret = process.env.SECRET_CRON_KEY || "";
  if (!secret || key !== secret) return NextResponse.json({ ok:false, error:"forbidden" }, { status:401 });

  const now = new Date();
  const sevenDaysAgo = addDays(sodUTC(now), -7);
  const sinceYesterday = addDays(sodUTC(now), -1);

  const subs = await prisma.subscription.findMany({
    where: {
      OR: [
        { status: "active", currentPeriodEnd: { gte: now } },
        { plan: "trial", currentPeriodEnd: { gte: now } },
      ],
    },
    select: { userId: true },
  });
  const userIds = Array.from(new Set(subs.map(s => s.userId)));
  let reminders = 0, congrats = 0;

  for (const userId of userIds) {
    const last = await prisma.userActivity.findFirst({ where: { userId }, orderBy: { occurredAt: "desc" } });
    const inactive = !last || (sodUTC(last.occurredAt).getTime() < sevenDaysAgo.getTime());
    if (inactive) {
      const user = await prisma.user.findUnique({ where: { id: userId } }).catch(()=>null) as any;
      const to = user?.email || "(unknown)";
      await sendMail({
        to, subject: "On reprend ? 👋",
        text: `Bonjour,

Nous n'avons pas vu d'activité depuis quelques jours.
Reviens terminer un exercice : 10 minutes suffisent pour relancer la machine 💪

À tout de suite sur Site Sciences.`
      }).catch(()=>{});
      reminders++;
    }

    const newBadges = await prisma.userBadge.findMany({ where: { userId, earnedAt: { gte: sinceYesterday } }});
    if (newBadges.length) {
      const user = await prisma.user.findUnique({ where: { id: userId } }).catch(()=>null) as any;
      const to = user?.email || "(unknown)";
      const list = newBadges.map(b=>`• ${b.badgeKey}`).join("\n");
      await sendMail({
        to, subject: "Bravo pour tes nouveaux badges 🎉",
        text: `Super !

Tu viens de débloquer:
${list}

Continue sur ta lancée — chaque petite séance compte.
L'équipe Site Sciences`
      }).catch(()=>{});
      congrats += newBadges.length;
    }
  }

  return NextResponse.json({ ok:true, checked: userIds.length, reminders, congrats });
}
