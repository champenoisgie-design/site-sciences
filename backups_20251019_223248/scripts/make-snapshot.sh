#!/usr/bin/env bash
set -euo pipefail

# Usage: scripts/make-snapshot.sh "message optionnel pour le commit/tag"
MSG="${1:-"snapshot"}"

# Vérifs git
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "❌ Ce dossier n'est pas un repo git."; exit 1
fi

# Vérif état (on permet des changements en staging mais on snapshot quand même)
STAMP="$(date +"%Y%m%d_%H%M%S")"
SNAP="backups_${STAMP}"
TAG="Save_${STAMP}"

echo "▶ Création snapshot: ${SNAP}"
mkdir -p "${SNAP}"

# Sync des répertoires/fichiers utiles (sans node_modules, .next, .env*)
rsync -a --delete-excluded \
  --exclude ".env*" --exclude ".next" --exclude "node_modules" --exclude ".git" \
  src prisma public scripts disabled_files backups plan print \
  package.json package-lock.json tsconfig.json tsconfig.tsbuildinfo \
  eslint.config.mjs postcss.config.* prettier.config.mjs \
  tailwind.config.* next.config.* README* README_SECURITY_NOTES.txt \
  "${SNAP}" || true

git add "${SNAP}" || true

# Ajout note README
if [ -f README.md ]; then
  {
    echo ""
    echo "## Save ${STAMP}"
    echo "- Snapshot: ${SNAP}"
  } >> README.md
  git add README.md
fi

# Commit snapshot
git commit -m "chore(backup): ${MSG} (${STAMP})" || echo "ℹ️ rien à committer (peut-être déjà propre)"

# Pousser snapshot si commit créé
if git rev-parse --verify HEAD >/dev/null 2>&1; then
  CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
  git push origin "${CURRENT_BRANCH}" || true
fi

# Tag & push
git tag -a "${TAG}" -m "Point d’étape: ${MSG} - ${STAMP}" || true
git push origin "${TAG}" || true

echo "✅ Snapshot & tag OK → ${SNAP} | ${TAG}"
