const fs = require("fs");

const file = "src/app/panier/page.tsx";
let s = fs.readFileSync(file, "utf8");

function must(cond, msg) {
  if (!cond) {
    console.error("❌", msg);
    process.exit(1);
  }
}

must(s.includes("/*__SS_RIGHT_RECAP_UI__*/"), "Marker /*__SS_RIGHT_RECAP_UI__*/ introuvable (le récap UI n'a pas été injecté).");
must(s.includes("{money(totalMonthly)}"), "Ancre {money(totalMonthly)} introuvable.");

const start = s.indexOf("/*__SS_RIGHT_RECAP_UI__*/");
const end = s.indexOf("{money(totalMonthly)}", start);
must(end > start, "Impossible de délimiter le bloc UI à remplacer.");

const before = s.slice(0, start);
const after = s.slice(end); // on garde {money(totalMonthly)} + la suite

const replacement = `/*__SS_RIGHT_RECAP_UI__*/
<div className="mt-4 space-y-3">
  {/* Onglet actif */}
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Récap onglet</div>
        <div className="truncate text-sm font-semibold text-slate-900">{tabRecap.title}</div>
      </div>
      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
        {tab === "subjects" ? "Matières" : tab === "themes" ? "Thèmes" : tab === "learning" ? "Modes" : "Chapitres"}
      </span>
    </div>

    <div className="px-4 py-3">
      <div className="space-y-2">
        {tabRecap.lines.map((l, idx) => (
          <div key={idx} className="flex items-start justify-between gap-3">
            <div className="min-w-0 text-sm text-slate-600">
              <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-slate-300" />
              <span className="break-words">{l.label}</span>
            </div>
            {l.value ? (
              <span className="shrink-0 rounded-lg bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-900">
                {l.value}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Récap général */}
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Récap général</div>
        <div className="truncate text-sm font-semibold text-slate-900">{globalRecap.title}</div>
      </div>
      <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        {duration === "annual" ? "Annuel" : "Mensuel"}
      </span>
    </div>

    <div className="px-4 py-3">
      <div className="space-y-2">
        {globalRecap.lines.map((l, idx) => {
          const isTotalToday = l.label === "Total aujourd’hui";
          const isTotalSub = l.label === "Total abonnement";
          const valueClass =
            isTotalToday ? "bg-slate-900 text-white" :
            l.tone === "good" ? "bg-emerald-50 text-emerald-800" :
            "bg-slate-50 text-slate-900";

          return (
            <div
              key={idx}
              className={
                "flex items-center justify-between gap-3 " +
                (isTotalToday ? "mt-3 rounded-xl border border-slate-900/10 bg-slate-900/5 p-2" : "")
              }
            >
              <div className={"min-w-0 text-sm " + (isTotalToday ? "font-semibold text-slate-900" : "text-slate-600")}>
                <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-slate-300" />
                <span className="break-words">{l.label}</span>
              </div>

              {l.value ? (
                <span className={"shrink-0 rounded-lg px-2 py-1 text-xs font-semibold " + valueClass}>
                  {l.value}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <span className="font-semibold">Total abonnement</span> = €/mois.
        <span className="ml-2 font-semibold">Total aujourd’hui</span> = (mensuel ou annuel) + achats uniques.
      </div>
    </div>
  </div>
</div>

`;

const newContent = before + replacement + after;

// Nettoyage commentaires HTML au cas où
const cleaned = newContent.replace(/^\s*<!--[\s\S]*?-->\s*$/gm, "");

fs.writeFileSync(file, cleaned, "utf8");
console.log("✅ UI récap droite améliorée (compact/premium).");
