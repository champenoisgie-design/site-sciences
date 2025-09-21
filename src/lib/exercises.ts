import type { AnyGrade, Subject, School } from "@/lib/school"

export type Exercise = {
  id: string
  title: string
  school: School
  grade: AnyGrade
  subject: Subject
  difficulty: "facile" | "moyen" | "difficile"
}

export const exercises: Exercise[] = [
  { id: "ex-maths-6e-1", title: "Fractions : simplification", school: "college", grade: "6e", subject: "Maths", difficulty: "facile" },
  { id: "ex-maths-3e-1", title: "Équations du 1er degré", school: "college", grade: "3e", subject: "Maths", difficulty: "moyen" },
  { id: "ex-pc-2nde-1",  title: "Vitesse moyenne & MRU", school: "lycee", grade: "2nde", subject: "Physique-Chimie", difficulty: "facile" },
  { id: "ex-pc-1re-1",   title: "Énergie et transferts", school: "lycee", grade: "1re", subject: "Physique-Chimie", difficulty: "moyen" },
  { id: "ex-svt-5e-1",   title: "Cellule et organites", school: "college", grade: "5e", subject: "SVT", difficulty: "facile" },
  { id: "ex-svt-Term-1", title: "Génétique des populations", school: "lycee", grade: "Terminale", subject: "SVT", difficulty: "difficile" },
]
