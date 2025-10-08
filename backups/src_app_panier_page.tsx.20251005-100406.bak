"use client";
import React from "react";
import { PRICING, MODE_ADDON, CART_RULES } from "@/lib/pricing";
import { useRouter } from "next/navigation";

import PaidSuccessNotice from "../../components/trial/PaidSuccessNotice";

import CheckoutDebugButton from "../../components/checkout/CheckoutDebugButton";

import ServerTruthBlock from "../../components/pricing/ServerTruthBlock";

import TrialExpiredNotice from "../../components/trial/TrialExpiredNotice";

type ModeKey = "TDAH"|"DYS"|"TSA"|"HPI";
const ALL_MODES: ModeKey[] = ["TDAH","DYS","TSA","HPI"];
const LEVELS = ["6e","5e","4e","3e","2nde","1re","Term"];
const SUBJECTS = ["Maths","Physique-Chimie","SVT","Technologie"];

export default function PanierPage() {
  const router = useRouter();

  // Facturation
  const [billing, setBilling] = React.useState<"monthly"|"yearly">("monthly");

  // Abonnement n°1
  const [plan, setPlan] = React.useState<"normal"|"gold"|"platine">("normal");
  const [level, setLevel] = React.useState<string>("1re");
  const [subjects, setSubjects] = React.useState<string[]>([]);
  const [modes, setModes] = React.useState<ModeKey[]>([]);

  // Abonnement n°2 (mode famille)
  const [family, setFamily] = React.useState<boolean>(false);
  const [plan2, setPlan2] = React.useState<"normal"|"gold"|"platine">("normal");
  const [level2, setLevel2] = React.useState<string>("1re");
  const [subjects2, setSubjects2] = React.useState<string[]>([]);
  const [modes2, setModes2] = React.useState<ModeKey[]>([]);

  const [referral, setReferral] = React.useState<string>("");

  const isFirst100Promo = true; // à câbler serveur

  // Prix plan
  const planCost = React.useMemo(() => {
    const p = (PRICING as any).plans[plan][billing];
    return typeof p === "number" ? p : 0;
  }, [plan, billing]);

  const planCost2 = React.useMemo(() => {
    if (!family) return 0;
    const p = (PRICING as any).plans[plan2][billing];
    return typeof p === "number" ? p : 0;
  }, [family, plan2, billing]);

  // Coûts des modes
  const modesCost = React.useMemo(() => {
    const unit = MODE_ADDON.monthly;
    const factor = billing === "yearly" ? 12 : 1;
    return modes.length * unit * factor;
  }, [modes.length, billing]);

  const modesCost2 = React.useMemo(() => {
    if (!family) return 0;
    const unit = MODE_ADDON.monthly;
    const factor = billing === "yearly" ? 12 : 1;
    return modes2.length * unit * factor;
  }, [family, modes2.length, billing]);

  // Remise 3/4 matières (somme des deux abonnements)
  const discountSubjects = React.useMemo(() => {
    const n = subjects.length + (family ? subjects2.length : 0);
    const basis = planCost + planCost2 + modesCost + modesCost2;
    if (n >= 4) return basis * CART_RULES.discount4Subjects;
    if (n >= 3) return basis * CART_RULES.discount3Subjects;
    return 0;
  }, [subjects.length, subjects2.length, family, planCost, planCost2, modesCost, modesCost2]);

  // -5% parrainage
  const referralDiscount = React.useMemo(() => {
    const subtotal = planCost + planCost2 + modesCost + modesCost2 - discountSubjects;
    return referral.trim() ? 0.05 * subtotal : 0;
  }, [referral, planCost, planCost2, modesCost, modesCost2, discountSubjects]);

  // -20% 100 premiers
  const first100Discount = React.useMemo(() => {
    const subtotal = planCost + planCost2 + modesCost + modesCost2 - discountSubjects - referralDiscount;
    return isFirst100Promo ? CART_RULES.first100PromoPct * subtotal : 0;
  }, [isFirst100Promo, planCost, planCost2, modesCost, modesCost2, discountSubjects, referralDiscount]);

  // **Remise famille** (ex: -10%) si activé, après les remises précédentes
  const familyDiscount = React.useMemo(() => {
    const subtotal = planCost + planCost2 + modesCost + modesCost2 - discountSubjects - referralDiscount - first100Discount;
    return family ? CART_RULES.familyDiscountPct * subtotal : 0;
  }, [family, planCost, planCost2, modesCost, modesCost2, discountSubjects, referralDiscount, first100Discount]);

  // Total
  const total = React.useMemo(() => {
    const subtotal = planCost + planCost2 + modesCost + modesCost2
      - discountSubjects - referralDiscount - first100Discount - familyDiscount;
    return Math.max(0, subtotal);
  }, [planCost, planCost2, modesCost, modesCost2, discountSubjects, referralDiscount, first100Discount, familyDiscount]);

  // Helpers
  function toggleSubject(s: string) {
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x!==s) : [...prev, s]);
  }
  function toggleMode(m: ModeKey) {
    setModes(prev => prev.includes(m) ? prev.filter(x => x!==m) : [...prev, m]);
  }
  function toggleSubject2(su: string) {
    setSubjects2(prev => prev.includes(su) ? prev.filter(x => x!==su) : [...prev, su]);
  }
  function toggleMode2(m: ModeKey) {
    setModes2(prev => prev.includes(m) ? prev.filter(x => x!==m) : [...prev, m]);
  }

  async function onCheckout() {
    alert(`Paiement (stub). Total: ${total.toFixed(2)} €/${billing==="monthly"?"mois":"mois (eng. annuel)"}`);
  }

  return (<>
      <TrialExpiredNotice />
      <PaidSuccessNotice />

    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Panier</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Col.1 — Facturation & Plan & Famille */}
        <div className="border rounded-lg p-4">
          <div className="font-semibold mb-2">Facturation</div>
          <div className="inline-flex rounded overflow-hidden border">
            <button onClick={()=>setBilling("monthly")} className={`px-3 py-1 ${billing==="monthly"?"bg-black text-white":"bg-white"}`}>Mensuel</button>
            <button onClick={()=>setBilling("yearly")} className={`px-3 py-1 ${billing==="yearly"?"bg-black text-white":"bg-white"}`}>Annuel</button>
          </div>

          <div className="font-semibold mt-4 mb-2">Plan</div>
          <div className="space-y-2">
            <label className="flex items-center gap-2"><input type="radio" checked={plan==="normal"} onChange={()=>setPlan("normal")} /><span>Normal</span></label>
            <label className="flex items-center gap-2"><input type="radio" checked={plan==="gold"} onChange={()=>setPlan("gold")} /><span>Gold</span></label>
            <label className="flex items-center gap-2"><input type="radio" checked={plan==="platine"} onChange={()=>setPlan("platine")} /><span>Platine</span></label>
          </div>

          <div className="font-semibold mt-4 mb-2">Mode Famille</div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={family} onChange={e=>setFamily(e.target.checked)} />
            <span>Activer — pour plusieurs abonnements au sein de la même famille</span>
          </label>
        </div>

        {/* Col.2 — Abonnement n°1 */}
        <div className="border rounded-lg p-4">
          <div className="font-semibold mb-2">Abonnement n°1 — paramètres</div>

          <div className="font-semibold mb-2">Niveau</div>
          <select className="border rounded px-2 py-1" value={level} onChange={e=>setLevel(e.target.value)}>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          <div className="font-semibold mt-4 mb-2">Matières</div>
          <div className="grid grid-cols-2 gap-2">
            {SUBJECTS.map(s => (
              <label key={s} className="flex items-center gap-2 border rounded px-2 py-1">
                <input type="checkbox" checked={subjects.includes(s)} onChange={()=>toggleSubject(s)} />
                <span>{s}</span>
              </label>
            ))}
          </div>

          <div className="font-semibold mt-4 mb-2">Modes complémentaires</div>
          <div className="grid grid-cols-2 gap-2">
            {ALL_MODES.map(m => (
              <label key={m} className="flex items-center gap-2 border rounded px-2 py-1">
                <input type="checkbox" checked={modes.includes(m)} onChange={()=>toggleMode(m)} />
                <span>{m}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Col.3 — Récap */}
        <div className="border rounded-lg p-4">
          <div className="font-semibold mb-2">Récapitulatif</div>
          <ul className="text-sm space-y-1">
            <li>Abonnement n°1 — Plan ({plan}): {planCost.toFixed(2)} €/{billing==="monthly"?"mois":"mois (eng. annuel)"}</li>
            {family && <li>Abonnement n°2 — Plan ({plan2}): {planCost2.toFixed(2)} €/{billing==="monthly"?"mois":"mois (eng. annuel)"}</li>}
            <li>Modes complémentaires: +{(modesCost + (family?modesCost2:0)).toFixed(2)} €</li>
            {(subjects.length + (family?subjects2.length:0))>=4 && (
              <li>Réduc 4 matières: -{(CART_RULES.discount4Subjects*100).toFixed(0)}%</li>
            )}
            {(subjects.length + (family?subjects2.length:0))>=3 && (subjects.length + (family?subjects2.length:0))<4 && (
              <li>Réduc 3 matières: -{(CART_RULES.discount3Subjects*100).toFixed(0)}%</li>
            )}
            {!!referral.trim() && <li>Parrainage: -5%</li>}
            <li>Promo 100 premiers: -{(CART_RULES.first100PromoPct*100).toFixed(0)}%</li>
            {family && <li>Réduc famille: -{(CART_RULES.familyDiscountPct*100).toFixed(0)}%</li>}
          </ul>

          <div className="font-semibold mt-4 mb-2">Code parrainage</div>
          <input className="border rounded w-full px-2 py-1" placeholder="Ex: SCI-ABCD" value={referral} onChange={e=>setReferral(e.target.value)} />

          <div className="text-xl font-bold mt-3">
            Total: {total.toFixed(2)} €/{billing==="monthly"?"mois":"mois (eng. annuel)"}
          </div>
          <button onClick={onCheckout} className="mt-3 w-full bg-black text-white rounded-md py-2 hover:opacity-90">Passer au paiement</button>
        </div>
      </div>

      {/* Zone Abonnement n°2 (si famille) */}
      {family && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <div className="font-semibold mb-2">Abonnement n°2 — paramètres</div>

            <div className="font-semibold mb-2">Plan</div>
            <div className="space-y-2">
              <label className="flex items-center gap-2"><input type="radio" checked={plan2==="normal"} onChange={()=>setPlan2("normal")} /><span>Normal</span></label>
              <label className="flex items-center gap-2"><input type="radio" checked={plan2==="gold"} onChange={()=>setPlan2("gold")} /><span>Gold</span></label>
              <label className="flex items-center gap-2"><input type="radio" checked={plan2==="platine"} onChange={()=>setPlan2("platine")} /><span>Platine</span></label>
            </div>

            <div className="font-semibold mt-4 mb-2">Niveau</div>
            <select className="border rounded px-2 py-1" value={level2} onChange={e=>setLevel2(e.target.value)}>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            <div className="font-semibold mt-4 mb-2">Matières</div>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECTS.map(su => (
                <label key={su} className="flex items-center gap-2 border rounded px-2 py-1">
                  <input type="checkbox" checked={subjects2.includes(su)} onChange={()=>toggleSubject2(su)} />
                  <span>{su}</span>
                </label>
              ))}
            </div>

            <div className="font-semibold mt-4 mb-2">Modes complémentaires</div>
            <div className="grid grid-cols-2 gap-2">
              {ALL_MODES.map(m => (
                <label key={m} className="flex items-center gap-2 border rounded px-2 py-1">
                  <input type="checkbox" checked={modes2.includes(m)} onChange={()=>toggleMode2(m)} />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mentions légales */}
      <div className="border rounded-lg p-4 text-sm text-gray-700">
        <h2 className="font-semibold mb-2">Informations légales & facturation</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Droit de rétractation 14 jours selon les cas ; exécution immédiate = limitation du droit.</li>
          <li>Prix TTC. Facturation mensuelle ou annuelle.</li>
          <li>Remises (parrainage, premiers abonnés, famille) appliquées au paiement.</li>
          <li>Un e-mail récapitulatif est envoyé après paiement.</li>
        </ul>
      </div>

      <button onClick={()=>router.push("/tarifs")} className="text-sm underline">← Revenir aux tarifs</button>
    </div>
    <div className="mx-auto max-w-4xl px-6"><ServerTruthBlock />
        <CheckoutDebugButton /></div>
    </>
);
}
