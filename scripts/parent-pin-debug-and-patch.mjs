import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function read(p){ return fs.readFileSync(path.join(ROOT,p), "utf8"); }
function write(p, s){
  const abs = path.join(ROOT,p);
  fs.mkdirSync(path.dirname(abs), { recursive:true });
  fs.writeFileSync(abs, s, "utf8");
}
function exists(p){ return fs.existsSync(path.join(ROOT,p)); }

const files = [
  "src/app/api/parent-pin/set/route.ts",
  "src/app/api/parent-pin/verify/route.ts",
  "src/app/api/parent-pin/status/route.ts",
];

for (const f of files){
  if (!exists(f)) throw new Error(`Missing ${f}`);
}

function wrapHandler(source){
  // Ajoute un try/catch global si pas déjà présent
  if (source.includes("/*__SS_TRY_CATCH__*/")) return source;

  // Cherche export async function (GET|POST)
  // On encapsule le body dans try/catch tout en gardant les imports.
  const m = source.match(/export\s+async\s+function\s+(GET|POST)\s*\([^\)]*\)\s*\{\n([\s\S]*)\n\}\s*$/m);
  if (!m) return source;

  const verb = m[1];
  const body = m[2];

  const patched =
`${source.replace(m[0], "").trimEnd()}

export async function ${verb}${source.match(/export\s+async\s+function\s+${verb}\s*(\([^\)]*\))/)?.[1] ?? "(req: Request)"} {
/*__SS_TRY_CATCH__*/
  try {
${body.split("\n").map(l => "    " + l).join("\n")}
  } catch (e: any) {
    // Toujours renvoyer un JSON, jamais une réponse vide
    const message = e?.message ?? "UNKNOWN_ERROR";
    const stack = process.env.NODE_ENV === "development" ? (e?.stack ?? null) : null;
    return (await import("next/server")).NextResponse.json(
      { error: "INTERNAL_ERROR", message, stack },
      { status: 500 }
    );
  }
}
`;
  return patched;
}

for (const f of files){
  const src = read(f);
  const out = wrapHandler(src);
  write(f, out);
}

console.log("✅ Patched parent-pin routes with global try/catch JSON error response.");
