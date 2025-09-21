export type School = "college" | "lycee"

export type CollegeGrade = "6e" | "5e" | "4e" | "3e"
export type LyceeGrade = "2nde" | "1re" | "Terminale"
export type AnyGrade = CollegeGrade | LyceeGrade

export const gradesBySchool: Record<School, AnyGrade[]> = {
  college: ["6e", "5e", "4e", "3e"],
  lycee: ["2nde", "1re", "Terminale"],
}

// L'intitulé officiel reste "Sciences de la Vie et de la Terre (SVT)"
export type Subject = "Maths" | "Physique-Chimie" | "SVT"

export const subjects: Subject[] = ["Maths", "Physique-Chimie", "SVT"]

export type Selection = {
  school?: School
  grade?: AnyGrade
  subject?: Subject
}
