import fs from "fs";
import path from "path";

const ROOT = process.cwd();
function p(x){ return path.join(ROOT, x); }
function read(f){ return fs.readFileSync(p(f), "utf8"); }
function write(f, s){
  fs.mkdirSync(path.dirname(p(f)), { recursive: true });
  fs.writeFileSync(p(f), s, "utf8");
}
function exists(f){ return fs.existsSync(p(f)); }

const setFile = "src/app/api/parent-pin/set/route.ts";
const verifyFile = "src/app/api/parent-pin/verify/route.ts";
if (!exists(setFile) || !exists(verifyFile)) throw new Error("Missing parent-pin route files");

let setSrc = read(setFile);
let verifySrc = read(verifyFile);

// Helper snippet to ensure user exists (by id then fallback by email)
const ensureFn = `
async function ensureDbUser(user: any) {
  // user expected shape: { id?, email? }
  if (!user?.email) return null;

  // 1) try by id if provided
  if (user?.id) {
    const byId = await prisma.user.findUnique({ where: { id: user.id } });
    if (byId) return byId;
  }

  // 2) fallback by email (stable unique)
  const byEmail = await prisma.user.findUnique({ where: { email: user.email } });
  if (byEmail) return byEmail;

  // 3) create minimal user record if missing
  return prisma.user.create({
    data: {
      email: user.email,
      name: user.name ?? null,
      image: user.image ?? null,
      emailVerified: user.emailVerified ?? null,
    },
  });
}
`;

// Inject helper into both files if not present
function injectEnsure(src){
  if (src.includes("function ensureDbUser")) return src;
  // insert after imports
  const idx = src.indexOf("\n\nexport ");
  if (idx === -1) return src;
  return src.slice(0, idx) + "\n\n" + ensureFn.trim() + "\n\n" + src.slice(idx+2);
}

setSrc = injectEnsure(setSrc);
verifySrc = injectEnsure(verifySrc);

// Patch SET: replace prisma.user.update(where: { id: user.id }) with dbUser.id
setSrc = setSrc.replace(
  /await\s+prisma\.user\.update\(\{\s*where:\s*\{\s*id:\s*user\.id\s*\}\s*,/m,
  `const dbUser = await ensureDbUser(user);\n  if (!dbUser) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 400 });\n\n  await prisma.user.update({\n    where: { id: dbUser.id },`
);

// If the route didn't match, do a safer broader replacement (optional)
if (!setSrc.includes("const dbUser = await ensureDbUser(user);")) {
  // try to find first prisma.user.update and wrap it
  setSrc = setSrc.replace(/await\s+prisma\.user\.update\(\{/m,
`const dbUser = await ensureDbUser(user);
  if (!dbUser) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 400 });

  await prisma.user.update({`);
  // also adjust where id usage if present later
  setSrc = setSrc.replace(/where:\s*\{\s*id:\s*user\.id\s*\}/m, "where: { id: dbUser.id }");
}

// Patch VERIFY: change findUnique({ where: { id: user.id }}) -> ensureDbUser(user)
verifySrc = verifySrc.replace(
  /const\s+dbUser\s*=\s*await\s+prisma\.user\.findUnique\(\{\s*where:\s*\{\s*id:\s*user\.id\s*\}\s*\}\);/m,
  `const dbUser = await ensureDbUser(user);`
);

// If not matched, handle alternative
if (!verifySrc.includes("const dbUser = await ensureDbUser(user);")) {
  verifySrc = verifySrc.replace(/const\s+dbUser\s*=\s*await\s+prisma\.user\.findUnique\([^\)]*\);/m,
    `const dbUser = await ensureDbUser(user);`
  );
}

write(setFile, setSrc);
write(verifyFile, verifySrc);

console.log("✅ Patched parent-pin set/verify to ensure DB user exists (fallback by email).");
