const fs = require("fs");
const path = require("path");
const file = path.join(process.cwd(), "src/app/layout.tsx");
let src = fs.readFileSync(file, "utf8");

// 5a) Ajouter import si absent
if (!src.includes('from "@/src/contexts/visualTheme"') && !src.includes('ClientVisualTheme')) {
  const lines = src.split("\n");
  // trouver le dernier import
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s.+from\s+["'][^"']+["'];?\s*$/.test(lines[i])) lastImport = i;
  }
  if (lastImport >= 0) {
    lines.splice(lastImport + 1, 0, 'import ClientVisualTheme from "@/src/app/ClientVisualTheme";');
    src = lines.join("\n");
  }
}

// 5b) Wrapper autour de {children}
if (!src.includes("<ClientVisualTheme>{children}</ClientVisualTheme>")) {
  src = src.replace(/\{children\}/, "<ClientVisualTheme>{children}</ClientVisualTheme>");
}

fs.writeFileSync(file, src, "utf8");
console.log("✔ layout.tsx patché.");
