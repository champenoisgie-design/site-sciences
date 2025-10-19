import Link from "next/link";
import type { NewsItem } from "@/lib/news";

function BadgeKind({ kind }: { kind: NewsItem["kind"] }) {
  const label =
    kind === "tutoriel" ? "Tutoriel" :
    kind === "exercice" ? "Exercice" :
    kind === "evenement" ? "Événement" :
    kind === "badge" ? "Badge" : "Mise à jour";
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
  );
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const d = new Date(item.date);
  const dateLabel = d.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" });
  return (
    <div className="rounded-2xl border p-4 hover:bg-accent transition">
      <div className="flex items-center justify-between">
        <BadgeKind kind={item.kind} />
        <span className="text-xs text-muted-foreground">{dateLabel}</span>
      </div>
      <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
      <div className="mt-3">
        <Link href={item.url} className="text-sm underline underline-offset-4">Voir</Link>
      </div>
    </div>
  );
}
