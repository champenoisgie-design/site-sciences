#!/usr/bin/env bash
set -euo pipefail
fail=0; ok(){echo "  ✅ $*";}; no(){echo "  ❌ $*"; fail=1;}

test -f src/app/page.tsx && ok "Accueil présent" || no "Manque src/app/page.tsx"
! grep -qE 'dynamic|HeroVideo|ThemeGate' src/app/page.tsx && ok "Accueil propre (sans dynamic/HeroVideo/ThemeGate)" || no "Accueil contient dynamic/HeroVideo/ThemeGate"

test -f "src/app/(preview)/layout.tsx" && ok "(preview)/layout présent" || no "Manque src/app/(preview)/layout.tsx"
test -f "src/app/(preview)/preview/accueil/page.tsx" && ok "/preview/accueil présent" || no "Manque /preview/accueil/page.tsx"
test -f "src/components/preview/BackgroundVideo.tsx" && ok "BackgroundVideo présent" || no "Manque BackgroundVideo.tsx"

if test -f src/components/cart/tabs/ThemesTab.tsx; then
  grep -q 'TryBeforeLinkFixer' src/components/cart/tabs/ThemesTab.tsx \
    && ok "Fixer monté dans ThemesTab (Essayer → Preview)" \
    || no "Fixer non monté dans ThemesTab (Essayer ne redirigera pas)"
fi

FOUND=0
for f in src/components/header/SiteHeader.tsx src/components/Header.tsx src/components/layout/Header.tsx src/components/common/Header.tsx; do
  if test -f "$f" && grep -q 'ThemeSelector' "$f"; then FOUND=1; ok "Sélecteur de thème présent dans $f"; fi
done
[ $FOUND -eq 1 ] || no "Sélecteur non injecté dans un header connu."

echo "▶ TypeScript (best effort)"; npx tsc --noEmit || true
[ $fail -eq 0 ] && echo "✅ Vérif OK." || { echo "❌ Vérif KO — copie les lignes ❌ ici."; exit 1; }
