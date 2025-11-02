#!/usr/bin/env bash
set -euo pipefail
fail=0; ok(){echo "  ✅ $*";}; no(){echo "  ❌ $*"; fail=1;}

test -f src/app/page.tsx && ok "Accueil présent" || no "Manque src/app/page.tsx"
if grep -q 'HeroVideo' src/app/page.tsx; then no "Accueil contient encore HeroVideo"; else ok "Accueil sans HeroVideo"; fi

test -f src/components/preview/TryBeforeLinkFixer.tsx && ok "TryBeforeLinkFixer présent" || no "Manque TryBeforeLinkFixer"
if test -f src/components/cart/tabs/ThemesTab.tsx; then
  if grep -q 'TryBeforeLinkFixer' src/components/cart/tabs/ThemesTab.tsx; then ok "Fixer monté dans ThemesTab"; else no "Fixer non monté dans ThemesTab"; fi
fi

FOUND=0
for f in src/components/header/SiteHeader.tsx src/components/Header.tsx; do
  if test -f "$f" && grep -q 'ThemeSelector' "$f"; then FOUND=1; ok "Sélecteur présent dans $f"; fi
done
[ $FOUND -eq 1 ] || no "Sélecteur non injecté (SiteHeader.tsx/Header.tsx)."

echo "▶ TypeScript (best effort)"; npx tsc --noEmit || true
[ $fail -eq 0 ] && echo "✅ Vérif OK." || { echo "❌ Vérif KO — copie les lignes ❌ ici."; exit 1; }
