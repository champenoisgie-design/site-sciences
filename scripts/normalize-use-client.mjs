import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(process.cwd(), 'src')
const exts = new Set(['.tsx', '.ts'])
const touched = []
const issues = []

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    else if (exts.has(path.extname(entry.name))) processFile(p)
  }
}

function processFile(file) {
  let src = fs.readFileSync(file, 'utf8')

  // 1) Supprime toutes les variantes parasites du style ;('use client')
  const before1 = src
  src = src.replace(
    /^\s*;\s*\(\s*['"]use client['"]\s*\)\s*;?\s*$(\r?\n)?/gm,
    '',
  )
  const rmWeird = src !== before1

  // 2) Détecte si la directive existe quelque part
  const hasDirective = /(^|\n)\s*['"]use client['"]\s*;?/.test(src)

  if (!hasDirective) {
    // Pas un composant client → rien à normaliser
    if (rmWeird) {
      fs.writeFileSync(file, src, 'utf8')
      touched.push(file)
    }
    return
  }

  // 3) Retire toutes les occurrences existantes de "use client"
  let cleaned = src.replace(
    /(^|\n)\s*['"]use client['"]\s*;?\s*(\r?\n)?/g,
    '\n',
  )
  cleaned = cleaned.replace(/^\uFEFF/, '') // BOM

  // 4) Réinjecte une seule directive tout en haut
  const fixed = `"use client"\n` + cleaned.replace(/^\s*\n+/, '')

  if (fixed !== src) {
    fs.writeFileSync(file, fixed, 'utf8')
    touched.push(file)
  }

  // 5) Signale si un composant client exporte encore "metadata"
  if (/export\s+const\s+metadata\s*=/.test(fixed)) {
    issues.push({
      file,
      issue: 'Composant client exporte `metadata` (à déplacer/supprimer).',
    })
  }
}

walk(ROOT)

console.log('✔ Normalisation terminée.')
console.log(`   Fichiers modifiés: ${touched.length}`)
for (const f of touched) console.log('   -', path.relative(process.cwd(), f))

if (issues.length) {
  console.log('\n⚠️  Problèmes détectés:')
  for (const it of issues)
    console.log('   -', path.relative(process.cwd(), it.file), '→', it.issue)
}
