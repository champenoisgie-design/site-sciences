#!/usr/bin/env bash
set -euo pipefail
fail=0; ok(){echo "  ✅ $*";}; no(){echo "  ❌ $*"; fail=1;}

test -f src/components/preview/BackgroundVideo.tsx && ok "BackgroundVideo présent" || no "Manque BackgroundVideo.tsx"
test -f src/app/(preview)/layout.tsx && ok "(preview)/layout présent" || no "Manque src/app/(preview)/layout.tsx"
test -f src/app/(preview)/preview/accueil/page.tsx && ok "/preview/accueil présent" || no "Manque /preview/accueil/page.tsx"

if test -f src/components/cart/tabs/ThemesTab.tsx; then
  if grep -q '/preview/accueil\?demo=' src/components/cart/tabs/ThemesTab.tsx; then
    ok "ThemesTab redirige 'Essayer…' vers /preview/accueil?demo="
  else
    no "ThemesTab ne redirige pas encore 'Essayer…' vers /preview/accueil?demo="
  fi
fi

for f in public/intro.mp4 public/themes/mario/preview.mp4 public/themes/onepiece/preview.mp4; do
  test -f "$f" && ok "$f présent" || no "Manque $f"
done

echo "▶ TypeScript (best effort)…"
npx tsc --noEmit || true

if [ $fail -ne 0 ]; then
  echo ""
  echo "❌ Des vérifications ont échoué. Copie-colle les lignes ❌ ici."
  exit 1
fi

echo ""
echo "✅ OK. Tests manuels :"
echo "  • /preview/accueil?demo=mario → vidéo plein écran en loop derrière le site"
echo "  • Depuis le panier → 'Essayer avant d’acheter' ouvre /preview/accueil?demo=<slug>"
