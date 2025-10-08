// src/app/api/cron/weekly/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sodUTC(d=new Date()){return new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));}
function addDays(d:Date,n:number){const x=new Date(d); x.setUTCDate(x.getUTCDate()+n); return x;}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const secret = process.env.SECRET_CRON_KEY || "";
  if (!secret || key !== secret) return NextResponse.json({ ok:false, error:"forbidden" }, { status:401 });

  const today = sodUTC(new Date());
  const from = addDays(today, -7);

  // Map parent -> [childrenIds]
  const links = await prisma.parentLink.findMany();
  const byParent = new Map<string,string[]>();
  for (const l of links) {
    const arr = byParent.get(l.parentUserId) || [];
    if (!arr.includes(l.studentUserId)) arr.push(l.studentUserId);
    byParent.set(l.parentUserId, arr);
  }

  let sent = 0;
  for (const [parentUserId, children] of byParent.entries()) {
    const parent = await prisma.user.findUnique({ where: { id: parentUserId } }).catch(()=>null) as any;
    const to = parent?.email || null;
    if (!to) continue;

    const lines: string[] = [];
    for (const childId of children) {
      const student = await prisma.user.findUnique({ where: { id: childId } }).catch(()=>null) as any;
      const label = student?.email || childId;

      const activities = await prisma.userActivity.findMany({
        where: { userId: childId, occurredAt: { gte: from, lt: addDays(today,1) } },
        orderBy: { occurredAt: "asc" }
      });
      const badges = await prisma.userBadge.findMany({
        where: { userId: childId, earnedAt: { gte: from, lt: addDays(today,1) } },
        orderBy: { earnedAt: "asc" }
      });

      const badgeList = badges.map(b=>`• ${b.badgeKey}`).join("\n") || "aucun";
      lines.push(`Élève: ${label}\n- Activités (7j): ${activities.length}\n- Badges: ${badgeList}\n`);
    }

    const body = `Bonjour,

Voici le récapitulatif des 7 derniers jours sur Site Sciences :

${lines.join("\n")}

Astuce: 10 minutes par jour suffisent pour relancer la machine 💪
À très vite,
L'équipe Site Sciences`;

    await sendMail({ to, subject: "Récap hebdo — progrès de votre enfant", text: body }).catch(()=>{});
    sent++;
  }

  return NextResponse.json({ ok:true, parents: byParent.size, sent });
}
