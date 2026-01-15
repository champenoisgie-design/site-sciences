import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}
function write(file, content) {
  fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, file), content, "utf8");
}
function exists(file) {
  return fs.existsSync(path.join(ROOT, file));
}

function ensureInPrismaSchema() {
  const schemaPath = "prisma/schema.prisma";
  if (!exists(schemaPath)) {
    throw new Error(`Missing ${schemaPath}`);
  }
  let schema = read(schemaPath);

  // ---- Ensure User fields
  if (!schema.includes("parentPinHash")) {
    // naive but effective: insert right before the last '}' of model User
    const userModelMatch = schema.match(/model\s+User\s*\{[\s\S]*?\n\}/m);
    if (!userModelMatch) throw new Error("model User not found in schema.prisma");

    const userModel = userModelMatch[0];
    if (userModel.includes("parentPinHash")) return;

    const insertion = `
  // --- Parents PIN (4 chiffres) ---
  parentPinHash        String?
  parentPinSetAt       DateTime?
  parentPinFailed      Int      @default(0)
  parentPinLockedUntil DateTime?
`;
    const patchedUserModel = userModel.replace(/\n\}\s*$/m, `${insertion}\n}`);
    schema = schema.replace(userModel, patchedUserModel);
  }

  // ---- Ensure ParentPinSession model
  if (!schema.includes("model ParentPinSession")) {
    const model = `

model ParentPinSession {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Identifiant stable de session (cookie -> table Session). On reste "device-aware" plus tard si besoin.
  sessionId     String
  unlockedUntil DateTime

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId, sessionId])
  @@unique([userId, sessionId])
}
`;
    schema += model;
  }

  write(schemaPath, schema);
}

function detectSessionCookieName() {
  // Heuristique: chercher cookies().set("...") dans src/lib/auth
  const authDir = path.join(ROOT, "src/lib/auth");
  const candidates = [];
  if (fs.existsSync(authDir)) {
    const files = fs.readdirSync(authDir).filter(f => f.endsWith(".ts") || f.endsWith(".tsx"));
    for (const f of files) {
      const p = path.join(authDir, f);
      const t = fs.readFileSync(p, "utf8");
      const re = /cookies\(\)\.set\(\s*["'`]([^"'`]+)["'`]/g;
      let m;
      while ((m = re.exec(t)) !== null) {
        candidates.push(m[1]);
      }
    }
  }
  // fallback common names
  const preferred = candidates.find(x => /session/i.test(x)) || candidates[0] || "session";
  return preferred;
}

function writePinLib() {
  write("src/lib/pin.ts", `import bcrypt from "bcryptjs";

export function assertPinFormat(pin: string) {
  if (!/^\\d{4}$/.test(pin)) throw new Error("PIN invalide (4 chiffres requis)");
}

export async function hashPin(pin: string) {
  assertPinFormat(pin);
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(pin, salt);
}

export async function verifyPin(pin: string, hash: string) {
  assertPinFormat(pin);
  return bcrypt.compare(pin, hash);
}
`);
}

function writeSessionIdHelper(cookieName) {
  // On part du principe que ta session "source de vérité" = cookie -> table Session
  // Ici on expose getSessionIdFromCookies() utilisé par le PIN.
  write("src/lib/auth/sessionId.ts", `import { cookies } from "next/headers";

/**
 * Renvoie l'identifiant de session stable basé sur le cookie HTTP-only.
 * Le nom du cookie est détecté automatiquement par script (fallback: "session").
 */
export function getSessionIdFromCookies(): string {
  const c = cookies().get(${JSON.stringify(cookieName)})?.value;
  if (!c) return "";
  return c;
}
`);
}

function writeParentPinGuard() {
  // IMPORTANT: on n'appelle PAS DeviceSession tant que la table n'est pas migrée partout.
  // On se base sur l'id de session stable (cookie).
  write("src/lib/parentPinGuard.ts", `import { prisma } from "@/lib/prisma";
import { getUserFromSessionServer } from "@/lib/auth/server";
import { getSessionIdFromCookies } from "@/lib/auth/sessionId";

export async function isParentPinUnlocked(): Promise<boolean> {
  const user = await getUserFromSessionServer();
  if (!user) return false;

  const sessionId = getSessionIdFromCookies();
  if (!sessionId) return false;

  try {
    const row = await prisma.parentPinSession.findUnique({
      where: { userId_sessionId: { userId: user.id, sessionId } },
    });
    return !!row && row.unlockedUntil > new Date();
  } catch {
    // si la table n'est pas encore migrée, on refuse sans crash
    return false;
  }
}

export async function requireParentPinUnlocked() {
  const ok = await isParentPinUnlocked();
  if (!ok) {
    const err = new Error("PARENT_PIN_REQUIRED");
    // @ts-expect-error tag
    err.code = "PARENT_PIN_REQUIRED";
    throw err;
  }
}
`);
}

function writeApiRoutes() {
  // Helpers: constants
  const constants = `const UNLOCK_MINUTES = 15;
const MAX_FAIL = 5;
const LOCK_MINUTES = 10;`;

  // /api/parent-pin/set
  write("src/app/api/parent-pin/set/route.ts", `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSessionServer } from "@/lib/auth/server";
import { hashPin } from "@/lib/pin";

export async function POST(req: Request) {
  const user = await getUserFromSessionServer();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const pin = String(body?.pin ?? "");

  const pinHash = await hashPin(pin);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      parentPinHash: pinHash,
      parentPinSetAt: new Date(),
      parentPinFailed: 0,
      parentPinLockedUntil: null,
    },
  });

  return NextResponse.json({ ok: true });
}
`);

  // /api/parent-pin/verify
  write("src/app/api/parent-pin/verify/route.ts", `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSessionServer } from "@/lib/auth/server";
import { getSessionIdFromCookies } from "@/lib/auth/sessionId";
import { verifyPin } from "@/lib/pin";

${constants}

export async function POST(req: Request) {
  const user = await getUserFromSessionServer();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.parentPinHash) return NextResponse.json({ error: "PIN_NOT_SET" }, { status: 400 });

  if (dbUser.parentPinLockedUntil && dbUser.parentPinLockedUntil > new Date()) {
    return NextResponse.json({ error: "PIN_LOCKED", lockedUntil: dbUser.parentPinLockedUntil }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const pin = String(body?.pin ?? "");

  const ok = await verifyPin(pin, dbUser.parentPinHash);

  if (!ok) {
    const failed = (dbUser.parentPinFailed ?? 0) + 1;
    const lockUntil = failed >= MAX_FAIL ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null;

    await prisma.user.update({
      where: { id: user.id },
      data: { parentPinFailed: failed, parentPinLockedUntil: lockUntil },
    });

    return NextResponse.json({ ok: false, error: "PIN_INVALID", failed, lockUntil }, { status: 400 });
  }

  // succès => reset compteur + unlock pour cette session
  await prisma.user.update({
    where: { id: user.id },
    data: { parentPinFailed: 0, parentPinLockedUntil: null },
  });

  const sessionId = getSessionIdFromCookies();
  if (!sessionId) return NextResponse.json({ error: "NO_SESSION_ID" }, { status: 400 });

  const unlockedUntil = new Date(Date.now() + UNLOCK_MINUTES * 60_000);

  // IMPORTANT: si la table n'est pas migrée, on renvoie une erreur explicite plutôt que crash
  try {
    await prisma.parentPinSession.upsert({
      where: { userId_sessionId: { userId: user.id, sessionId } },
      update: { unlockedUntil },
      create: { userId: user.id, sessionId, unlockedUntil },
    });
  } catch (e) {
    return NextResponse.json({ error: "PARENT_PIN_TABLE_MISSING" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, unlockedUntil });
}
`);

  // /api/parent-pin/status
  write("src/app/api/parent-pin/status/route.ts", `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSessionServer } from "@/lib/auth/server";
import { getSessionIdFromCookies } from "@/lib/auth/sessionId";

export async function GET() {
  const user = await getUserFromSessionServer();
  if (!user) return NextResponse.json({ unlocked: false, unlockedUntil: null });

  const sessionId = getSessionIdFromCookies();
  if (!sessionId) return NextResponse.json({ unlocked: false, unlockedUntil: null });

  try {
    const row = await prisma.parentPinSession.findUnique({
      where: { userId_sessionId: { userId: user.id, sessionId } },
    });

    const unlocked = !!row && row.unlockedUntil > new Date();
    return NextResponse.json({ unlocked, unlockedUntil: row?.unlockedUntil ?? null });
  } catch {
    // table pas migrée => pas de crash
    return NextResponse.json({ unlocked: false, unlockedUntil: null });
  }
}
`);
}

function writeTypeDepsNotice() {
  // bcryptjs needed
  const pkgPath = "package.json";
  if (!exists(pkgPath)) return;
  const pkg = JSON.parse(read(pkgPath));
  const deps = pkg.dependencies || {};
  if (!deps["bcryptjs"]) {
    console.log("NOTE: bcryptjs not found in dependencies; will be installed by terminal block.");
  }
}

function main() {
  ensureInPrismaSchema();

  const cookieName = detectSessionCookieName();
  writeSessionIdHelper(cookieName);

  writePinLib();
  writeParentPinGuard();
  writeApiRoutes();
  writeTypeDepsNotice();

  console.log(`✅ Parent PIN setup files written. Detected session cookie name: ${cookieName}`);
}

main();
