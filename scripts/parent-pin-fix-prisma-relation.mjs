import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const schemaPath = path.join(ROOT, "prisma/schema.prisma");

function read(p) { return fs.readFileSync(p, "utf8"); }
function write(p, s) { fs.writeFileSync(p, s, "utf8"); }

if (!fs.existsSync(schemaPath)) throw new Error("Missing prisma/schema.prisma");

let schema = read(schemaPath);

// locate model User block
const m = schema.match(/model\s+User\s*\{[\s\S]*?\n\}/m);
if (!m) throw new Error("model User not found");

let userBlock = m[0];

// already present?
if (!userBlock.includes("parentPinSessions")) {
  // Insert near other relations if possible; otherwise append before closing brace.
  // We insert right before final "}" of User model.
  const insertion = `\n  // --- Parents PIN relations ---\n  parentPinSessions ParentPinSession[]\n`;
  userBlock = userBlock.replace(/\n\}\s*$/m, `${insertion}\n}`);
  schema = schema.replace(m[0], userBlock);
}

write(schemaPath, schema);

console.log("✅ Added User.parentPinSessions relation if missing.");
