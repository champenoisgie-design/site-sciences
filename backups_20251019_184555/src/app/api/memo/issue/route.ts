// src/app/api/memo/issue/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSessionUser } from "../../../../lib/auth";
import { hash } from "../../../../lib/privacy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


import { Readable } from "node:stream";
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const subject = url.searchParams.get("subject") || "Maths";
    const level = url.searchParams.get("level") || "Lycée";
    const chapter = url.searchParams.get("chapter") || "Chapitre";

    const user = await getSessionUser().catch(()=>null);
    if (!user) {
      return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });
    }

    // Optionnel : vérifier accès (ici on laisse passer pour la démo si trial/payant est OK)
    const subs = await prisma.subscription.findFirst({
      where: { userId: user.id, status: "active", currentPeriodEnd: { gte: new Date() } },
      orderBy: { currentPeriodEnd: "desc" }
    });
    if (!subs) {
      return NextResponse.json({ ok:false, error:"no_active_subscription" }, { status: 403 });
    }

    // Génération PDF
    const now = new Date();
    const stamp = now.toISOString();
    const memoKey = `${subject}|${level}|${chapter}`;
    const sig = hash([user.id, stamp, memoKey].join("|"));

    const { PassThrough } = await import("stream");
    const PDFDocument = (await import("pdfkit")).default as typeof import("pdfkit");
    const QRCode = (await import("qrcode")).default as typeof import("qrcode");

    const doc: any = new PDFDocument({ size: "A4", margin: 50 });
    const stream = new PassThrough();
    doc.pipe(stream);

    // Titre
    doc.fontSize(18).text(`FICHE MÉMO — ${subject} (${level})`, { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Chapitre : ${chapter}`);
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#444").text(`Généré le ${now.toLocaleString("fr-FR")} — Utilisateur: ${user.email || user.id}`);

    // Watermark léger
    doc.save();
    doc.rotate(-30, { origin: [300, 400] });
    doc.fontSize(48).fillColor("#eeeeee").text(`Site Sciences`, 100, 300, { opacity: 0.4 });
    doc.restore();

    // Contenu placeholder (tu remplaceras par la vraie fiche)
    doc.moveDown(1.5);
    doc.fontSize(12).fillColor("#000").text("• Points clés du chapitre", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text("1) Définition / Théorème / Formule");
    doc.text("2) Exemple guidé");
    doc.text("3) Pièges fréquents");
    doc.moveDown(1);

    // Footer: watermark détaillé + QR de vérification
    const verifyUrl = `${url.origin}/api/memo/verify?u=${encodeURIComponent(user.id)}&t=${encodeURIComponent(stamp)}&s=${encodeURIComponent(memoKey)}&sig=${encodeURIComponent(sig)}`;
    const png = await QRCode.toBuffer(verifyUrl, { errorCorrectionLevel: "M" });
    const bottom = 780;

    doc.image(png, 50, bottom-80, { width: 70 });
    doc.fontSize(8).fillColor("#555").text(`Verification: ${verifyUrl}`, 130, bottom-68, { width: 420 });
    doc.fontSize(8).fillColor("#555").text(`WATERMARK — uid:${user.id} — sig:${sig.slice(0,16)}… — ${stamp}`, 50, bottom-12, { width: 500 });

    doc.end();

    const webStream = Readable.toWeb(stream as any) as unknown as ReadableStream;
    return new Response(webStream, {
      status: 200,
      headers: { 
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="memo_${subject}_${level}_${chapter}.pdf"`
       }
    });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || "server_error" }, { status: 500 });
  }
}
