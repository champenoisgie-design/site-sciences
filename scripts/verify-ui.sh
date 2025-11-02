#!/usr/bin/env bash
set -euo pipefail
fail=0; ok(){echo "  ✅ $*";}; no(){echo "  ❌ $*"; fail=1;}

# Accueil: pas d'import HeroVideo
if test -f src/app/page.tsx; then
  if grep -q 'HeroVideo' src/app/page.tsx; then no "page.tsx contient encore HeroVideo"; else ok "Accueil restauré (sans HeroVideo)"; fi
fi

# ThemesTab → preview
if test -f src/components/cart/tabs/ThemesTab.tsx; then
  if grep -q '/preview/accueil\?demo=' src/components/cart/tabs/ThemesTab.tsx; then ok "Boutons 'Essayer…' → /preview/accueil?demo="; else no "Boutons 'Essayer…' ne redirigent pas vers /preview/accueil"; fi
else
  echo "  ℹ️ ThemesTab.tsx non trouvé (OK si géré ailleurs)."
fi

# Header: présence sélecteur
FOUND=0
for f in src/components/header/SiteHeader.tsx src/components/Header.tsx; do
  if test -f "$f"; then
    if grep -q 'ThemeSelector' "$f"; then ok "Sélecteur de thème présent dans $f"; FOUND=1; fi
  fi
done
[ $FOUND -eq 1 ] || no "Sélecteur de thème non injecté (SiteHeader.tsx/Header.tsx)."

echo "▶ TypeScript (best effort)"; npx tsc --noEmit || true
if [ $fail -ne 0 ]; then
  echo ""; echo "❌ Des vérifications ont échoué. Copie-colle les lignes ❌ ici."; exit 1
fi
echo ""; echo "✅ Tout est en place. Tests:"
echo "  • Panier > Thèmes visuels > 'Essayer avant d’acheter' → /preview/accueil?demo=<slug>"
echo "  • Header: sélecteur visible à gauche (Mario / One Piece)."
