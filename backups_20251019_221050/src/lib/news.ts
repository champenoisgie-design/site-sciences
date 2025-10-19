export type NewsItem = {
  id: string;
  kind: "tutoriel" | "exercice" | "evenement" | "badge" | "update";
  title: string;
  summary: string;
  url: string;        // lien "Voir"
  level?: string;     // ex: "2nde", "1re", "Tale"
  subject?: string;   // ex: "Maths", "Physique", "SVT"
  date: string;       // ISO
};

const ALL_NEWS: NewsItem[] = [
  {
    id: "n1",
    kind: "tutoriel",
    title: "Dérivées — Terminale",
    summary: "Nouveau tuto avec exercices guidés + pièges fréquents.",
    url: "/tutoriels/derivées",
    level: "Tale",
    subject: "Maths",
    date: "2025-10-01",
  },
  {
    id: "n2",
    kind: "exercice",
    title: "Électricité — lois des nœuds",
    summary: "Série d’exercices progressifs, correction pas à pas.",
    url: "/exercices/electricite-noeuds",
    level: "2nde",
    subject: "Physique",
    date: "2025-09-29",
  },
  {
    id: "n3",
    kind: "evenement",
    title: "Tournoi multi-joueur (samedi)",
    summary: "Défis en live à 16h — rejoins la file d’attente.",
    url: "/multijoueur",
    date: "2025-10-04",
  },
  {
    id: "n4",
    kind: "badge",
    title: "Nouveau badge : Pionnier de l’essai",
    summary: "Débloqué après les 3 jours d’essai gratuit.",
    url: "/faq#badges",
    date: "2025-09-25",
  },
  {
    id: "n5",
    kind: "update",
    title: "Amélioration du mode TDAH",
    summary: "Consignes plus courtes et minuterie douce intégrée.",
    url: "/faq#tdah",
    date: "2025-09-22",
  },
];

export function getNews(opts?: { level?: string | null; subject?: string | null; limit?: number }) {
  const { level, subject, limit = 6 } = opts ?? {};
  let list = [...ALL_NEWS].sort((a,b) => (a.date < b.date ? 1 : -1));
  // Filtrage souple : si level/subject fournis, on priorise ce qui match, sinon on renvoie tout.
  if (level || subject) {
    const pri = list.filter(n =>
      (!level || !n.level || n.level === level) &&
      (!subject || !n.subject || n.subject === subject)
    );
    // garder au moins 3 éléments même si peu matchent
    if (pri.length >= 3) list = pri.concat(list.filter(n => !pri.includes(n)));
  }
  return list.slice(0, limit);
}
