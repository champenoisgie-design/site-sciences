#!/usr/bin/env bash
set -euo pipefail
fail=0; ok(){echo "  ✅ $*";}; no(){echo "  ❌ $*"; fail=1;}

test -f src/components/theme/ThemeGate.tsx && ok "ThemeGate présent" || no "Manque src/components/theme/ThemeGate.tsx"
test -f src/app/themes/[slug]/page.tsx && ok "Page thème présente" || no "Manque src/app/themes/[slug]/page.tsx"

if grep -q 'ThemeGate' src/app/themes/\[slug]/page.tsx; then
  ok "ThemeGate intégré dans /themes/[slug]"
else
  no "ThemeGate pas encore intégré dans /themes/[slug]"
fi

echo "▶ TypeScript (best effort)…"
npx tsc --noEmit || true

if [ $fail -ne 0 ]; then
  echo ""
  echo "❌ Des vérifications ont échoué. Copie-colle les lignes ❌ ici."
  exit 1
fi
echo ""
echo "✅ Gate OK. Teste :"
echo "  1) Ouvre /themes/mario (sans rien dans localStorage) → redirection /panier?theme=mario"
echo "  2) Dans la console: localStorage.setItem('theme:owned:mario','1'); puis recharge /themes/mario → accès au contenu."
