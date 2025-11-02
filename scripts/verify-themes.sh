#!/usr/bin/env bash
set -euo pipefail
fail=0; ok(){echo "  ✅ $*";}; no(){echo "  ❌ $*"; fail=1;}

echo "▶ Vérification Thèmes & Accueil…"
test -f src/components/home/HeroVideo.tsx && ok "HeroVideo présent" || no "Manque HeroVideo.tsx"
test -f src/app/page.tsx && ok "Accueil page.tsx présent" || no "Manque src/app/page.tsx"
test -f src/components/header/ThemeSelector.tsx && ok "ThemeSelector présent" || no "Manque ThemeSelector.tsx"

if test -f src/components/cart/tabs/ThemesTab.tsx; then
  if grep -q '/\?demo=' src/components/cart/tabs/ThemesTab.tsx; then
    ok "ThemesTab redirige 'Essayer avant d’acheter' vers /?demo="
  else
    no "ThemesTab ne redirige pas encore 'Essayer' vers /?demo="
  fi
else
  echo "  ℹ️ ThemesTab.tsx non trouvé (non bloquant)."
fi

test -f public/intro.mp4 && ok "intro.mp4 présent" || no "Manque public/intro.mp4"
test -f public/themes/mario/hero.mp4 && ok "mario/hero.mp4 présent" || no "Manque mario/hero.mp4"
test -f public/themes/onepiece/hero.mp4 && ok "onepiece/hero.mp4 présent" || no "Manque onepiece/hero.mp4"

echo "▶ TypeScript (best effort)…"
npx tsc --noEmit || true

if [ $fail -ne 0 ]; then
  echo ""
  echo "❌ Des vérifications ont échoué. Copie-colle ici les lignes ❌."
  exit 1
fi
echo ""
echo "✅ OK. Test visuel:"
echo " - /?demo=mario affiche la vidéo de Mario en fond."
echo " - Le sélecteur de thème est en haut à gauche ; Mario/One Piece → /themes/<slug> si possédé, sinon /panier?theme=<slug>."
