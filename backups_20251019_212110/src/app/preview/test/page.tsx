"use client";
import { useMemo, useState } from "react";

type Theme = "mario" | "onepiece" | "dbz";
type Subject = "maths" | "physique" | "chimie" | "svt";
type Level = "6e" | "5e" | "4e" | "3e" | "2nde" | "1ere" | "term";
type Mode = "normal" | "tdah" | "dys" | "tsa" | "hpi";

type Exercise = { title: string; prompt: string; hint: string; solution: string };
type ExoMap = Partial<Record<Subject, Partial<Record<Level, Partial<Record<Theme, Exercise>>>>>>;

const THEMES: { key: Theme; label: string }[] = [
  { key: "onepiece", label: "One Piece" },
  { key: "mario",    label: "Mario" },
  { key: "dbz",      label: "Dragon Ball Z" },
];

const SUBJECTS: { key: Subject; label: string }[] = [
  { key: "maths",    label: "Maths" },
  { key: "physique", label: "Physique" },
  { key: "chimie",   label: "Chimie" },
  { key: "svt",      label: "SVT" },
];

const LEVELS: { key: Level; label: string }[] = [
  { key: "6e", label: "6e" }, { key: "5e", label: "5e" }, { key: "4e", label: "4e" }, { key: "3e", label: "3e" },
  { key: "2nde", label: "2nde" }, { key: "1ere", label: "1ère" }, { key: "term", label: "Terminale" },
];

const MODES: { key: Mode; label: string }[] = [
  { key: "normal", label: "Normal" },
  { key: "tdah",   label: "TDAH" },
  { key: "dys",    label: "DYS" },
  { key: "tsa",    label: "TSA" },
  { key: "hpi",    label: "HPI" },
];

/** Démo d'exercices dynamiques (typage permissif pour la preview) */
const EXO: ExoMap = {
  maths: {
    "6e": {
      onepiece: { title: "Fractions à bord du Sunny", prompt: "Nami partage 3/4 entre 2 amis. Part de chacun ?", hint: "3/4 ÷ 2", solution: "3/8" },
      mario:    { title: "Pièces de Mario", prompt: "Mario a 24 pièces, il donne 1/3 à Luigi. Reste ?", hint: "24 × 2/3", solution: "16" },
      dbz:      { title: "Senzu en parts", prompt: "5/10 du sac en 5 parts égales ?", hint: "5/10 ÷ 5", solution: "1/10" },
    },
    "2nde": {
      onepiece: { title: "Affine", prompt: "f(x)=2x+3. f(5) ?", hint: "Remplace x=5", solution: "13" },
      mario:    { title: "Suite arithmétique", prompt: "u0=2, r=3. u5 ?", hint: "u_n=u0+n·r", solution: "17" },
      dbz:      { title: "Vecteurs", prompt: "AB=(2,-1) BC=(1,4). AC ?", hint: "Somme", solution: "(3,3)" },
    },
    "term": {
      onepiece: { title: "Complexes", prompt: "(2+i)(1-2i) ?", hint: "ac−bd + i(ad+bc)", solution: "4-3i" },
      mario:    { title: "Probas binomiale", prompt: "p=0,6, n=3, P(X≥2) ?", hint: "1−(P0+P1)", solution: "0,648" },
      dbz:      { title: "Limites", prompt: "lim (3x²−x)/(x²+1)", hint: "Coeff dominants", solution: "3" },
    }
  },
  physique: {
    "6e": {
      mario:    { title:"Vitesse kart", prompt:"d=200 m, t=25 s. v ?", hint:"v=d/t", solution:"8 m/s" },
      onepiece: { title:"Flottaison", prompt:"Bois flotte ? masse volumique ?", hint:"<1000 kg/m³", solution:"<1000 kg/m³" },
      dbz:      { title:"Énergie", prompt:"P=100 W, t=60 s, E ?", hint:"E=P·t", solution:"6000 J" },
    },
    "2nde": {
      mario:    { title:"MRU", prompt:"v=15 m/s, t=40 s. d ?", hint:"v·t", solution:"600 m" },
      onepiece: { title:"Poids", prompt:"m=60 kg, g=9,81. P ?", hint:"m·g", solution:"588,6 N" },
      dbz:      { title:"Ohm", prompt:"U=12 V, R=6 Ω. I ?", hint:"U/R", solution:"2 A" },
    },
    "term": {
      mario:    { title:"Énergie cinétique", prompt:"m=0,5 kg, v=20 m/s. Ec ?", hint:"1/2 m v²", solution:"100 J" },
      onepiece: { title:"Champ E", prompt:"q=2e−6 C, E=3e3 V/m. F ?", hint:"qE", solution:"0,006 N" },
      dbz:      { title:"Radioactivité", prompt:"λ=0,1 j⁻¹, t½ ?", hint:"ln2/λ", solution:"~6,93 j" },
    }
  },
  chimie: {
    "6e": {
      mario:    { title:"Mélanges", prompt:"Eau+sel : homogène ?", hint:"Oui", solution:"Oui" },
      onepiece: { title:"États", prompt:"La glace fond : fusion ?", hint:"Oui", solution:"Oui" },
      dbz:      { title:"Séparer sable/sel", prompt:"Procédé ?", hint:"Filtration+dissolution", solution:"Filtration+évaporation" },
    },
    "2nde": {
      mario:    { title:"M masse molaire", prompt:"NaCl ?", hint:"Na~23, Cl~35,5", solution:"~58,5 g/mol" },
      onepiece: { title:"pH", prompt:"pH=2 ?", hint:"<7", solution:"Acide" },
      dbz:      { title:"Réaction", prompt:"H₂+O₂ → ?", hint:"Eau", solution:"2H₂+O₂→2H₂O" },
    }
  },
  svt: {
    "6e": {
      onepiece:{ title:"Écosystèmes", prompt:"Définition ?", hint:"Milieu+vivants", solution:"…" },
      mario:   { title:"Chaîne alim.", prompt:"Qui mange qui ?", hint:"Producteur→consommateur", solution:"…" },
      dbz:     { title:"Cellule", prompt:"Rôle du noyau ?", hint:"ADN", solution:"…" },
    },
    "2nde": {
      onepiece:{ title:"Génétique", prompt:"Allèle ?", hint:"Variante de gène", solution:"…" },
      mario:   { title:"Tectonique", prompt:"Plaques ?", hint:"Mouvements", solution:"…" },
      dbz:     { title:"Immunité", prompt:"Antigène ?", hint:"Molécule reconnue", solution:"…" },
    }
  }
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export default function PreviewTestPage() {
  const [tab, setTab] = useState<"eleve" | "parents">("eleve");
  const [theme, setTheme] = useState<Theme>("onepiece");
  const [subject, setSubject] = useState<Subject>("maths");
  const [level, setLevel] = useState<Level>("6e");
  const [mode, setMode] = useState<Mode>("normal");

  const exo: Exercise | null = useMemo(() => {
    const bySubj = EXO[subject] ?? {};
    const byLvl = (bySubj as Record<string, any>)[level] ?? {};
    return ((byLvl as Record<string, any>)[theme] as Exercise) ?? null;
  }, [subject, level, theme]);

  return (
    <main className="px-6 py-10 mx-auto max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Page de test (prévisualisation)</h1>
      <div className="mb-6 flex items-center gap-3">
        <button onClick={()=>setTab("eleve")} className={`rounded-lg px-4 py-2 text-sm font-medium border ${tab==="eleve" ? "bg-black text-white" : "hover:bg-muted"}`}>Version élève</button>
        <button onClick={()=>setTab("parents")} className={`rounded-lg px-4 py-2 text-sm font-medium border ${tab==="parents" ? "bg-black text-white" : "hover:bg-muted"}`}>Version parents</button>
      </div>

      {tab === "eleve" ? (
        <>
          <section className="grid gap-3 md:grid-cols-4">
            <label className="rounded-xl border p-3 flex items-center justify-between">
              <span>Thème</span>
              <select value={theme} onChange={e=>setTheme(e.target.value as Theme)} className="rounded-lg border px-2 py-1">
                {THEMES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </label>
            <label className="rounded-xl border p-3 flex items-center justify-between">
              <span>Matière</span>
              <select value={subject} onChange={e=>setSubject(e.target.value as Subject)} className="rounded-lg border px-2 py-1">
                {SUBJECTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </label>
            <label className="rounded-xl border p-3 flex items-center justify-between">
              <span>Niveau</span>
              <select value={level} onChange={e=>setLevel(e.target.value as Level)} className="rounded-lg border px-2 py-1">
                {LEVELS.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
              </select>
            </label>
            <label className="rounded-xl border p-3 flex items-center justify-between">
              <span>Mode</span>
              <select value={mode} onChange={e=>setMode(e.target.value as Mode)} className="rounded-lg border px-2 py-1">
                {MODES.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
              </select>
            </label>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <Card title="Exercice (aperçu)">
              {exo ? (
                <div className="space-y-2">
                  <div className="font-medium">{exo.title}</div>
                  <div>{exo.prompt}</div>
                  {mode === "tdah" && <div className="rounded-lg bg-yellow-50 p-2">• Étape 1 ➜ lis la question.<br/>• Étape 2 ➜ surligne les nombres.<br/>• Étape 3 ➜ choisis la bonne formule.</div>}
                  {mode === "dys"  && <div className="rounded-lg bg-blue-50 p-2">Texte aéré + police lisible (DYS).</div>}
                  {mode === "tsa"  && <div className="rounded-lg bg-green-50 p-2">Repères visuels + routine d’étapes.</div>}
                  {mode === "hpi"  && <div className="rounded-lg bg-purple-50 p-2">Challenge : 2 méthodes différentes.</div>}
                </div>
              ) : (<div>Aperçu indisponible pour ce couple matière/niveau.</div>)}
            </Card>
            <Card title="Indice">
              <div>{exo?.hint ?? "—"}</div>
            </Card>
            <Card title="Solution (résumé)">
              <div>{exo?.solution ?? "—"}</div>
            </Card>
          </section>
        </>
      ) : (
        <section className="grid gap-4 md:grid-cols-3">
          <Card title="Suivi de la progression">
            Visualisez les notions réussies/à revoir, avec badges & séries.
          </Card>
          <Card title="Mode Famille">
            Gérez plusieurs enfants avec des matières/niveaux différents.
          </Card>
          <Card title="Paramètres d’apprentissage">
            Activez/désactivez les modes (TDAH, DYS, TSA, HPI) par enfant.
          </Card>
        </section>
      )}
    </main>
  );
}
