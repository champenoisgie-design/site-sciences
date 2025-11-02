#!/usr/bin/env bash
set -euo pipefail

fail=0

echo "▶ Vérification fichiers clés…"
check_file() {
  local f="$1"
  if [ -f "$f" ]; then
    echo "  ✅ $f"
  else
    echo "  ❌ Manquant: $f"
    fail=1
  fi
}

check_contains() {
  local f="$1"; shift
  local pat="$1"
  if grep -q "$pat" "$f"; then
    echo "  ✅ $f contient: $pat"
  else
    echo "  ❌ $f ne contient pas: $pat"
    fail=1
  fi
}

# Pricing backend
check_file "src/app/api/cart/price/route.ts"
check_contains "src/app/api/cart/price/route.ts" "appliedDiscounts"
check_contains "src/app/api/cart/price/route.ts" "combo ? 0.30 : (annual || family) ? 0.20 : 0.0"

# Panier / UI prix
check_file "src/components/cart/SummaryBar.tsx"
(check_contains "src/components/cart/SummaryBar.tsx" "Méga pack −30%" || check_contains "src/components/cart/SummaryBar.tsx" "Méga pack -30%") || true
check_contains "src/components/cart/SummaryBar.tsx" "Badge Premium activé"

check_file "src/components/cart/DiscountBanners.tsx"
check_contains "src/components/cart/DiscountBanners.tsx" "Passer en Annuel"

check_file "src/components/cart/CartIncentives.tsx"
check_contains "src/components/cart/CartIncentives.tsx" "Passez au mode Platine"

check_file "src/components/cart/StickyCheckoutBar.tsx"
check_contains "src/components/cart/StickyCheckoutBar.tsx" "createCheckoutSessionFallback"

# Flux mock paiement
check_file "src/app/merci/page.tsx"
check_contains "src/app/merci/page.tsx" "Essai gratuit"

check_file "src/app/abonnement/page.tsx"
check_contains "src/app/abonnement/page.tsx" "Mon abonnement"

# Thèmes
check_file "src/app/themes/[slug]/page.tsx"
check_file "public/themes/mario/manifest.json"
check_file "public/themes/onepiece/manifest.json"

echo "▶ TypeScript (best effort)…"
npx tsc --noEmit || true

echo "▶ Test API pricing (nécessite le serveur dev en route sur :3000)…"
set +e
resp=$(curl -sS --max-time 4 http://localhost:3000/api/pricing/test)
curl_rc=$?
set -e
if [ $curl_rc -ne 0 ] || [ -z "$resp" ]; then
  echo "  ⚠️  Impossible d'appeler /api/pricing/test (le serveur n'est peut-être pas démarré)."
  echo "  Action: lance 'npm run dev', ouvre http://localhost:3000/api/pricing/test et copie-colle ici la réponse si souci."
else
  echo "  ✅ Réponse /api/pricing/test :"
  echo "$resp" | sed 's/^/    /'
fi

if [ $fail -ne 0 ]; then
  echo ""
  echo "❌ Des vérifications ont échoué."
  echo "👉 Copie-colle les lignes ❌ ci-dessus ici pour que je corrige immédiatement."
  exit 1
fi

echo ""
echo "✅ Vérifications statiques OK."
echo "Vérifie visuellement :"
echo " - /tarifs démarre en Annuel (toggle sur Annuel)."
echo " - /panier : badges Annuel/Famille ou 'Méga pack −30%'."
echo " - Bouton 'Acheter maintenant' → /merci, puis /abonnement."
