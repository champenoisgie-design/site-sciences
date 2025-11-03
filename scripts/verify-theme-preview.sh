#!/usr/bin/env bash
set -euo pipefail
ok(){ echo "  ✅ $*"; }; no(){ echo "  ❌ $*"; exit 1; }

test -f 'src/app/(preview)/layout.tsx' && ok "(preview)/layout présent" || no "Manque src/app/(preview)/layout.tsx"
test -f 'src/app/(preview)/preview/accueil/page.tsx' && ok "/preview/accueil présent" || no "Manque /preview/accueil/page.tsx"
test -f 'src/components/preview/BackgroundVideo.tsx' && ok "BackgroundVideo présent" || no "Manque BackgroundVideo.tsx"
test -f 'src/components/preview/TryBeforeLinkFixer.tsx' && ok "TryBeforeLinkFixer présent" || no "Manque TryBeforeLinkFixer.tsx"
test -f 'src/components/cart/TryBeforeMount.tsx' && ok "TryBeforeMount présent" || no "Manque TryBeforeMount.tsx"

HDR="src/components/Header.tsx"
test -f "$HDR" && grep -q 'ThemeSelector' "$HDR" && ok "ThemeSelector injecté dans Header" || echo "ℹ️ Vérifie visuellement le header."

echo ""
echo "✅ Ouvre: /preview/accueil?demo=mario  (fond vidéo en loop)"
echo "✅ Sur /panier > Thèmes visuels > 'Essayer avant d’acheter' → redirige vers /preview/accueil?demo=<slug>"
