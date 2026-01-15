import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = process.cwd();
const dbPath = path.join(ROOT, "prisma/dev.db");

if (!fs.existsSync(dbPath)) {
  throw new Error("Missing prisma/dev.db (SQLite).");
}

function runSql(sql) {
  // macOS: sqlite3 is usually available
  const cmd = `sqlite3 "${dbPath}" ${JSON.stringify(sql)}`;
  return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] }).toString("utf8").trim();
}

console.log("== DB path ==");
console.log(dbPath);

console.log("\n== Tables (filter User/ParentPin) ==");
console.log(runSql(`SELECT name FROM sqlite_master WHERE type='table' AND name IN ('User','ParentPinSession','_prisma_migrations');`));

console.log("\n== User columns (name|type) ==");
console.log(runSql(`PRAGMA table_info('User');`));

console.log("\n== ParentPinSession columns (if exists) ==");
try {
  console.log(runSql(`PRAGMA table_info('ParentPinSession');`));
} catch (e) {
  console.log("(table does not exist)");
}

console.log("\n== Recent migrations ==");
try {
  console.log(runSql(`SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 10;`));
} catch {
  console.log("(no _prisma_migrations table?)");
}
