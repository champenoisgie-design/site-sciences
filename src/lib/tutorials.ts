import type { AnyGrade, Subject, School } from "@/lib/school"

export type Tutorial = {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
  category?: string
  school: School
  grade: AnyGrade
  subject: Subject
  content: string
}

export const tutorials: Tutorial[] = [
  {
    slug: "mecanique-newton",
    title: "Mécanique de Newton — bases et exercices",
    excerpt: "Forces, lois de Newton, mouvements et applications simples.",
    updatedAt: "2025-09-20",
    category: "Physique",
    school: "lycee",
    grade: "2nde",
    subject: "Physique-Chimie",
    content: `
## Objectifs
- Comprendre les trois lois de Newton
- Appliquer les diagrammes de forces

## Contenu
1. Première loi…
2. Deuxième loi…
3. Troisième loi…

\`\`\`ts
// Exemple
const F = m * a
\`\`\`
`.trim(),
  },
  {
    slug: "thermo-intro",
    title: "Thermodynamique — introduction",
    excerpt: "Systèmes, variables d’état et premier principe.",
    updatedAt: "2025-09-18",
    category: "Physique",
    school: "lycee",
    grade: "1re",
    subject: "Physique-Chimie",
    content: `
## Plan
- Système, frontière, environnement
- Travail et chaleur
- Premier principe
`.trim(),
  },
  {
    slug: "svt-cellule",
    title: "SVT — La cellule : structure et fonctions",
    excerpt: "Observer et comprendre l’unité du vivant.",
    updatedAt: "2025-09-15",
    category: "SVT",
    school: "college",
    grade: "5e",
    subject: "SVT",
    content: `
## À retenir
- Membrane, cytoplasme, noyau
- Microscopie, organites
`.trim(),
  },
  {
    slug: "maths-fractions",
    title: "Fractions — simplification et opérations",
    excerpt: "Addition, soustraction, multiplication et division de fractions.",
    updatedAt: "2025-09-10",
    category: "Maths",
    school: "college",
    grade: "6e",
    subject: "Maths",
    content: `
## Exemples guidés
1/2 + 1/3 = …
`.trim(),
  },
]
