// PATCH_TAG_MODES_CLASSIQUE_PANIER_V3
"use client";





/*__SS_SKIN_CATALOG_V2__*/
const SKIN_CATALOG = [
  // Anime / Manga
  { group: "Anime / Manga", key: "DRAGON_BALL", label: "Dragon Ball Z / Super" },
  { group: "Anime / Manga", key: "DEMON_SLAYER", label: "Demon Slayer" },
  { group: "Anime / Manga", key: "ONE_PIECE", label: "One Piece" },
  { group: "Anime / Manga", key: "NARUTO", label: "Naruto" },
  { group: "Anime / Manga", key: "SAILOR_MOON", label: "Sailor Moon" },

  // Jeux vidéo
  { group: "Jeux vidéo", key: "MARIO", label: "Mario" },
  { group: "Jeux vidéo", key: "MINECRAFT", label: "Minecraft" },
  { group: "Jeux vidéo", key: "ZELDA", label: "Zelda" },
  { group: "Jeux vidéo", key: "POKEMON", label: "Pokémon" },
  { group: "Jeux vidéo", key: "FORTNITE", label: "Fortnite" },
  { group: "Jeux vidéo", key: "ROBOT", label: "Robot" },
  { group: "Jeux vidéo", key: "OVERWATCH", label: "Overwatch" },
  { group: "Jeux vidéo", key: "WORLD_OF_WARCRAFT", label: "World of Warcraft" },

  // Films / Séries
  { group: "Films / Séries", key: "MARVEL", label: "Marvel" },
  { group: "Films / Séries", key: "HARRY_POTTER", label: "Harry Potter" },
  { group: "Films / Séries", key: "STRANGER_THINGS", label: "Stranger Things" },
  { group: "Films / Séries", key: "MERCREDI", label: "Mercredi" },
  { group: "Films / Séries", key: "MY_HERO_ACADEMIA", label: "My Hero Academia" },
] as const;

const SKIN_KEYS = SKIN_CATALOG.map((s) => s.key);
const SKIN_GROUPS = Array.from(new Set(SKIN_CATALOG.map((s) => s.group)));
/*__SS_SKIN_CATALOG_V2_END__*/

/*__SS_SKIN_LOGO_SLOT_V2__*/
function SkinLogoSlot() {
  return (
    <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-500">
      LOGO
    </div>
  );
}
/*__SS_SKIN_LOGO_SLOT_V2_END__*/



// PROMO_RECAP_TODAY_CENTS_V1 (module helper)
// Objectif: afficher les remises sur le "Total aujourd’hui" (annuel), comme Stripe.
function __cents(n: number) { return Math.round(n); }
function __eurToCents(eur: number) { return __cents(eur * 100); }
function __formatEURFromCents(cents: number) {
  try { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100); }
  catch { return ((cents/100).toFixed(2)).replace(".", ",") + " €"; }
}

// Calcule la promo à appliquer comme le serveur (famille / matières / cumul -30)
function __computePromoFromSubjectsCompact(subjectsCompact: string) {
  const entries = String(subjectsCompact || "")
    .split("|")
    .map(x => x.trim())
    .filter(Boolean);

  // entries: "4e:Maths"
  const grades = entries.map(e => e.split(":")[0]?.trim()).filter(Boolean);
  const uniqueGrades = Array.from(new Set(grades));
  const counts = grades.reduce((acc: any, g: string) => { acc[g] = (acc[g] || 0) + 1; return acc; }, {});
  const isFamily = uniqueGrades.length >= 2; // ≥2 niveaux
  const isMatieres = Object.values(counts).some((n: any) => Number(n) >= 3); // ≥3 même niveau

  let percent = 0;
  let label = "";
  if (isFamily && isMatieres) { percent = 30; label = "Pack Famille + Matières (-30%)"; }
  else if (isFamily)          { percent = 20; label = "Pack Famille activé (-20%)"; }
  else if (isMatieres)        { percent = 10; label = "Remise matières (≥ 3 même niveau) (-10%)"; }

  return { percent, label, isFamily, isMatieres, entriesCount: entries.length, uniqueGrades, counts };
}

import { useParentPinModal } from "@/components/parent-pin/useParentPinModal";
import { fetchWithParentPinRetry } from "@/components/parent-pin/fetchWithParentPinRetry";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = "normal" | "gold" | "platine";
type Duration = "monthly" | "annual";

type UpsellKey = "parents" | "coach" | "pdf" | "ia";
type ThemePack = "mario" | "onepiece";
type SkinKey = (typeof SKIN_CATALOG)[number]["key"];
/*__SS_ADDONS_TYPES__*/
type LearningAddon = "tdah" | "dys" | "tsa" | "hpi";

const LEARNING_ADDON_PRICE_MONTHLY = 2.99; // abonnement (mensuel ou annuel)
const SKIN_PRICE_ONE_TIME = 2.99;          // achat unique

const LEARNING_ADDONS: Array<{ key: LearningAddon; label: string; desc: string }> = [
  { key: "tdah", label: "TDAH", desc: "Timers + micro-étapes + anti-distraction" },
  { key: "dyslexie", label: "Dyslexie", desc: "Texte aéré + repères visuels stables" },
  { key: "dyscalculie", label: "Dyscalculie", desc: "Étapes claires + calcul guidé" },
  { key: "dyspraxie", label: "Dyspraxie", desc: "Interface espacée + actions simples" },
  { key: "dysgraphie", label: "Dysgraphie", desc: "Rédaction assistée + réponses guidées" },
  { key: "tsa",  label: "TSA",  desc: "Structure + prévisibilité + feedback stable" },
  { key: "hpi",  label: "HPI",  desc: "Parcours accéléré + défis avancés" },
];

type CartItem = { id: string; level: string; subject: string };

const PLAN_META: Record<Plan, { label: string; monthly: number }> = {
  normal: { label: "Normal", monthly: 12.49 },
  gold: { label: "Gold", monthly: 19.99 },
  platine: { label: "Platine", monthly: 24.99 },
};

const LEVELS = ["6e", "5e", "4e", "3e", "2nde", "1ere", "Tle"];
const SUBJECTS = ["Maths", "Physique-Chimie", "SVT", "Français", "Histoire-Géo"];

const UPSELLS: Array<{ key: UpsellKey; label: string; desc: string; monthly: number }> = [
  { key: "parents", label: "Parents+", desc: "Tableau de bord parents + suivi", monthly: 6 },
  { key: "coach", label: "Coach hebdo", desc: "Mini-plan personnalisé / semaine", monthly: 9 },
  { key: "pdf", label: "Fiches PDF", desc: "Téléchargements illimités", monthly: 4 },
  { key: "ia", label: "Assistant IA", desc: "Aide pas-à-pas (limité)", monthly: 5 },
];

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}
function money(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}
function readPlan(p: string | null): Plan {
  if (p === "normal" || p === "gold" || p === "platine") return p;
  return "gold";
}

export default function PanierPage() {
  // =======================================
  // ===============================
  
  // ===============================
  
  // ===============================
  // Platine = tout inclus : options forcées cochées + non modifiables
  // FIX_GLOBAL_RECAP_V3: TDZ-safe (ne touche pas tabRecap avant sa déclaration)
  let globalRecap: any = { title: "Récap général", lines: [] as any[] };

  const { open: openParentPin, ParentPinModal } = useParentPinModal();
  const sp = useSearchParams();
  
  // =======================================
  // UPSSELLS_RESET_ON_PLAN_REACTIVE_V1
  // =======================================
  const __planLower = String(sp?.get?.("plan") ?? "").toLowerCase();

  // =======================================
  // RECAP_OPTIONS_INCLUDED_V1
  // =======================================
  const __isGoldPlan = __planLower === "gold";
  const __isPlatinePlan = __planLower === "platine";
  const __parentsIncludedByPlan = __isGoldPlan || __isPlatinePlan;
  const __allOptionsIncludedByPlan = __isPlatinePlan;

  const __upsellMonthlyEffective = (k, monthly) => {
    if (__allOptionsIncludedByPlan) return 0;
    if (k === "parents" && __parentsIncludedByPlan) return 0;
    return monthly;
  };

  const __upsellIncludedEffective = (k) => {
    if (__allOptionsIncludedByPlan) return true;
    if (k === "parents" && __parentsIncludedByPlan) return true;
    return false;
  };
  // END_RECAP_OPTIONS_INCLUDED_V1


  useEffect(() => {
    if (__planLower === "platine") {
      setSelectedUpsells({ parents: true, coach: true, pdf: true, ia: true });
      return;
    }
    if (__planLower === "gold") {
      // Gold: Parents+ seulement
      setSelectedUpsells({ parents: true, coach: false, pdf: false, ia: false });
      return;
    }
    // Normal / fallback
    setSelectedUpsells({ parents: false, coach: false, pdf: false, ia: false });
  }, [__planLower]);
  // END_UPSSELLS_RESET_ON_PLAN_REACTIVE_V1


  // ===============================
  // PLATINE_OPTIONS_LOCK_V9 (FINAL)
  // ===============================
  // Basé sur ?plan=platine
  const __planNameForOptions = (() => {
    try { return String(new URLSearchParams(window.location.search).get("plan") ?? ""); }
    catch { return ""; }
  })();
const __isPlatine = __planNameForOptions.toLowerCase() === "platine";

  const __effectiveOptions = __isPlatine
    ? { parentsPlus: true, coachHebdo: true, pdf: true, ai: true }
    : ((typeof (globalThis as any).options !== "undefined" ? (options as any) : undefined) ??
       { parentsPlus: false, coachHebdo: false, pdf: false, ai: false });
const __optionPriceLabel = (txt: string) => (__isPlatine ? "Inclus" : txt);



    const __optChecked = (v: any) => (__isPlatine ? true : !!v);
// ===============================
    const router = useRouter();

  // ✅ PROD : pas de switch visitor/subscribed (c’était dev only)
  const [tab, setTab] = useState<"subjects" | "themes" | "learning" | "chapters">("subjects");
  const [plan, setPlan] = useState<Plan>(readPlan(sp.get("plan")));
  const [duration, setDuration] = useState<Duration>("annual");

  const [items, setItems] = useState<CartItem[]>([{ id: "i1", level: "4e", subject: "Physique-Chimie" }]);
  const [selectedUpsells, setSelectedUpsells] = useState<Record<UpsellKey, boolean>>({
    parents: false,
    coach: false,
    pdf: false,
    ia: false,
  });

  
  // ===============================
  // PLATINE_UPSELLS_FORCE_V2
  // ===============================
  const __ALL_UPSELLS = { parents: true, coach: true, pdf: true, ia: true } as const;
  const __effectiveUpsells: Record<UpsellKey, boolean> =
    __isPlatine ? (__ALL_UPSELLS as any) : (selectedUpsells as any);
/*__SS_ADDONS_STATE__*/
  const [selectedLearning, setSelectedLearning] = useState<Record<LearningAddon, boolean>>({
    tdah: false, dys: false, tsa: false, hpi: false,
  });

  // achat unique: on peut acheter 1+ skins (même si on en "utilise" un seul)
  const [purchasedSkins, setPurchasedSkins] = useState<Record<SkinKey, boolean>>({

  });

  // ✅ PROD : pas d’ownership mock (tout est “non acheté” tant qu’on n’a pas le backend)
  const owned = useMemo(() => {
    return {
      parentsOwned: false,
      themeOwned: {} as Partial<Record<ThemePack, boolean>>,
      skinOwned: {} as Partial<Record<SkinKey, boolean>>,
    };
  }, []);

  // Thème/skin : on lit le choix global sauvegardé (home)
  const [themePack, setThemePack] = useState<ThemePack>("mario");
  const [activeSkin, setActiveSkin] = useState<SkinKey>(SKIN_KEYS[0] as any);
useEffect(() => {
    try {
      const t = localStorage.getItem("ss_theme_pack");
      const sk = localStorage.getItem("ss_skin_key");
      if (sk && (SKIN_KEYS as any).includes(sk)) setActiveSkin(sk as any);
} catch {}
  }, []);

  

  useEffect(() => {
    try { localStorage.setItem("ss_skin_key", String(activeSkin)); } catch {}
  }, [activeSkin]);
// garde plan dans l’URL (pratique)
  useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    params.set("plan", plan);
    router.replace(`/panier?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  const annualDiscountActive = duration === "annual";
  const annualDiscountRate = annualDiscountActive ? 0.2 : 0;

    // Remise famille: uniquement si au moins 2 niveaux différents
  const levelCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const it of items) m[it.level] = (m[it.level] || 0) + 1;
    return m;
  }, [items]);

  const uniqueLevelsCount = useMemo(() => Object.keys(levelCounts).length, [levelCounts]);

  const familyDiscountEligible = uniqueLevelsCount >= 2;
  const familyDiscountActive = familyDiscountEligible;

  // Remise matières (même niveau): dès 3 matières dans le même niveau => -10%
  // (non cumulable avec la remise famille)
  const bulkSameLevelActive = !familyDiscountActive && Object.values(levelCounts).some((n) => n >= 3);
  const bulkSameLevelRate = 0.10;

  const baseMonthly = PLAN_META[plan].monthly * items.length;

  /*__SS_PARENTS_INCLUDED__*/
  const parentsIncluded = plan === "gold" || plan === "platine";

  // Auto-coché si inclus (et non facturé)
  useEffect(() => {
    if (!parentsIncluded) return;
    if (__planLower !== "normal") setSelectedUpsells((p) => ({ ...p, parents: true }));

// =======================================
}, [parentsIncluded]);

  const upsellMonthly = useMemo(() => {
    let t = 0;
    for (const u of UPSELLS) {
      if (!__effectiveUpsells[u.key]) continue;
      if (u.key === "parents" && (parentsIncluded || owned.parentsOwned)) continue;
      t += u.monthly;
    }
    return t;
  }, [selectedUpsells, owned.parentsOwned, parentsIncluded]);

  const learningMonthly = useMemo(() => {
    const n = Object.values(selectedLearning).filter(Boolean).length;
    return Math.round(n * LEARNING_ADDON_PRICE_MONTHLY * 100) / 100;
  }, [selectedLearning]);

  const skinsOneTime = useMemo(() => {
    const n = Object.values(purchasedSkins).filter(Boolean).length;
    return Math.round(n * SKIN_PRICE_ONE_TIME * 100) / 100;
  }, [purchasedSkins]);

  /*__SS_ADDONS_TOTALS__*/
  const totalMonthly = useMemo(() => {
    let t = baseMonthly + upsellMonthly + learningMonthly;
    if (annualDiscountRate) t = t * (1 - annualDiscountRate);
    // Remises non cumulables: famille prioritaire, sinon bulk même niveau
    if (familyDiscountActive) {
      t = t * 0.8;
    } else if (bulkSameLevelActive) {
      t = t * (1 - bulkSameLevelRate);
    }
    return Math.round(t * 100) / 100;
  }, [baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate, familyDiscountActive, bulkSameLevelActive, bulkSameLevelRate]);

  /*__SS_DISCOUNT_DISPLAY__*/
  // Pour l'affichage du récap: montant mensuel AVANT remise famille / bulk (mais après remise annuelle si active)
  const beforeLevelDiscountMonthly = useMemo(() => {
    let t = baseMonthly + upsellMonthly + learningMonthly;
    if (annualDiscountRate) t = t * (1 - annualDiscountRate);
    return Math.round(t * 100) / 100;
  }, [baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate]);

  const familyDiscountMonthlyValue = useMemo(() => {
    if (!familyDiscountActive) return 0;
    // -20% sur le total avant remise famille (après annuel)
    return Math.round(beforeLevelDiscountMonthly * 0.20 * 100) / 100;
  }, [familyDiscountActive, beforeLevelDiscountMonthly]);

  const bulkSameLevelDiscountMonthlyValue = useMemo(() => {
    if (!bulkSameLevelActive) return 0;
    return Math.round(beforeLevelDiscountMonthly * bulkSameLevelRate * 100) / 100;
  }, [bulkSameLevelActive, beforeLevelDiscountMonthly, bulkSameLevelRate]);

  // Total facturé aujourd’hui = abonnement (mensuel ou annuel) + achats uniques (skins)
  const totalDueToday = useMemo(() => {
    // Recalc autonome (évite toute dépendance d'ordre à totalMonthly)
    let recurring = baseMonthly + upsellMonthly + learningMonthly;
    if (annualDiscountRate) recurring = recurring * (1 - annualDiscountRate);
    if (familyDiscountActive) {
      recurring = recurring * 0.8;
    } else if (bulkSameLevelActive) {
      recurring = recurring * (1 - bulkSameLevelRate);
    }
    recurring = Math.round(recurring * 100) / 100;

    const recurringCharge = duration === "annual" ? recurring * 12 : recurring;
    const t = recurringCharge + skinsOneTime;
    return Math.round(t * 100) / 100;
  }, [baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate, familyDiscountActive, bulkSameLevelActive, bulkSameLevelRate, duration, skinsOneTime]);

  /*__SS_RIGHT_RECAP_MODEL__*/
  // --- Modèle récap (onglet + global) ---
  const selectedUpsellsMonthly = useMemo(() => {
    return UPSELLS
      .filter((u) => __effectiveUpsells[u.key])
      .map((u) => ({
        key: u.key,
        label: u.label,
        monthly: __upsellMonthlyEffective(u.key, (u.key === "parents" && (parentsIncluded || owned.parentsOwned)) ? 0 : u.monthly),
        included: (__upsellIncludedEffective(u.key) || (u.key === "parents" && parentsIncluded)) ? true : false,
        owned: (u.key === "parents" && owned.parentsOwned) ? true : false,
      }))
      .filter((u) => u.monthly > 0 || u.included || u.owned);
  }, [selectedUpsells, parentsIncluded, owned.parentsOwned]);

  const selectedLearningList = useMemo(() => {
    return Object.entries(selectedLearning)
      .filter(([, v]) => v)
      .map(([k]) => k);
  }, [selectedLearning]);

  const purchasedSkinsList = useMemo(() => {
    return Object.entries(purchasedSkins)
      .filter(([, v]) => v)
      .map(([k]) => k);
  }, [purchasedSkins]);

  const itemsByLevel = useMemo(() => {
    const m: Record<string, Array<string>> = {};
    for (const it of items) {
      m[it.level] = m[it.level] || [];
      m[it.level].push(it.subject);
    }
    return m;
  }, [items]);

  const tabRecap = useMemo(() => {
    // FIX_LINES_V1: lines était manquant -> évite crash runtime
    const lines: any[] = [];

return { title: "Récap général", lines };
  }, [
    plan,
    items.length,
    baseMonthly,
    selectedUpsellsMonthly,
    learningMonthly,
    selectedLearningList.length,
    skinsOneTime,
    familyDiscountActive,
    bulkSameLevelActive,
    typeof familyDiscountMonthlyValue !== "undefined" ? familyDiscountMonthlyValue : 0,
    typeof bulkSameLevelDiscountMonthlyValue !== "undefined" ? bulkSameLevelDiscountMonthlyValue : 0,
    totalMonthly,
    totalDueToday,
  ]);

  
  // FIX_GLOBAL_RECAP_ASSIGN_V1: après init tabRecap seulement
  globalRecap = tabRecap;

const addItem = () => {
    const id = `i${Math.random().toString(16).slice(2)}`;
    setItems((p) => [...p, { id, level: "5e", subject: "Maths" }]);
  };
  const removeItem = (id: string) => setItems((p) => p.filter((x) => x.id !== id));
  const updateItem = (id: string, patch: Partial<CartItem>) =>
    setItems((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const toggleUpsell = (k: UpsellKey) => {
    if (__isPlatine) return;
    if (k === "parents" && parentsIncluded) return;
    if (k === "parents" && owned.parentsOwned) return;
    setSelectedUpsells((p) => ({ ...p, [k]: !p[k] }));
  };

  const checkout = () => {
    const params = new URLSearchParams();
    params.set("plan", plan);
    params.set("duration", duration);
    params.set("items", items.map((i) => `${i.level}:${i.subject}`).join("|"));

    const ups = Object.entries(__effectiveUpsells)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(",");
    if (ups) params.set("upsells", ups);

    const learn = Object.entries(selectedLearning).filter(([,v]) => v).map(([k]) => k).join(",");
    if (learn) params.set("learning", learn);

    const skins = Object.entries(purchasedSkins).filter(([,v]) => v).map(([k]) => k).join(",");
    if (skins) params.set("skins", skins);

    params.set("theme", themePack);
    params.set("skin", String(activeSkin));

    /*__SS_ADDONS_CHECKOUT__*/

    router.push(`/panier/confirmation?${params.toString()}`);
  };

  async function startStripeCheckout() {
    
    /*__SS_DEBUG_CART_V1__*/
    try {
      console.log("[cart] selectedUpsells =", typeof selectedUpsells !== "undefined" ? selectedUpsells : null);
      console.log("[cart] selectedLearning =", typeof selectedLearning !== "undefined" ? selectedLearning : null);
      console.log("[cart] purchasedSkins =", typeof purchasedSkins !== "undefined" ? purchasedSkins : null);
      console.log("[cart] plan/duration =", { plan, duration });
      console.log("[cart] items =", Array.isArray(items) ? items : null);
    } catch (e) {
      console.log("[cart] debug log error", e);
    }
    /*__SS_DEBUG_CART_V1_END__*/
// Map duration -> period attendu par l'API checkout/session
    const period = duration === "annual" ? "Annuel" : "Mensuel";

    // items attendu par l'API : tableau (tu as déjà un format "level:subject" dans l'URL confirmation)
    // Ici on récupère depuis ton state "items" s'il existe, sinon on fallback sur un tableau vide
    const payload: any = {
      plan: (plan === "normal" ? "Normal" : plan === "gold" ? "Gold" : "Platine"),
      period,
      items: (Array.isArray(items) ? items : []),
      distinctLevelsCount: typeof distinctLevelsCount === "number" ? distinctLevelsCount : undefined,
    };

    /*__SS_CHECKOUT_ITEMS_FIX_V2__*/
    // Normalize items to what backend expects (grade + subject) and prevent empty checkout
    const checkoutItems = (items || [])
      .map((it: any) => {
        const grade = String((it as any)?.grade ?? (it as any)?.level ?? (it as any)?.classe ?? "");
        const subject = String((it as any)?.subject ?? (it as any)?.matiere ?? (it as any)?.subjectKey ?? "");
        return { ...it, grade, subject, quantity: Math.max(1, Number((it as any)?.quantity ?? 1)) };
      })
      .filter((it: any) => it?.grade && it?.subject);

    // Send learning modes too (backend logs selectedLearning/learning)
    const checkoutSelectedLearning =
      (typeof selectedLearning !== "undefined") ? selectedLearning : undefined;
    /*__SS_CHECKOUT_ITEMS_FIX_V2_END__*/


    const res = await fetchWithParentPinRetry("/api/checkout/session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        plan,
        period: duration === "annual" ? "Annuel" : "Mensuel",
        items: checkoutItems,
        selectedUpsells: (typeof __effectiveUpsells !== "undefined" ? __effectiveUpsells : selectedUpsells),
        // learning modes (send both keys for compatibility)
        selectedLearning: checkoutSelectedLearning,
        learning: checkoutSelectedLearning,
        // skins purchase map
        skins: (typeof purchasedSkins !== "undefined" ? purchasedSkins : undefined),
      }),
      },
      openParentPin
    );

    const data = await res.json().catch(() => ({}));

    
    // ---- SAFETY GUARARD: never assume data.url exists ----
    const url = (data && typeof (data as any).url === "string") ? (data as any).url : "";
    if (!res.ok) {
      console.error("checkout/session failed:", { status: res.status, data });
      alert(((data as any)?.error) || "Erreur paiement");
      return;
    }
    if (!url) {
      console.error("checkout/session missing url:", data);
      alert("Erreur paiement: URL Stripe manquante. (Voir console / logs serveur)");
      return;
    }
if (!res.ok) {
      alert(data?.error || "Erreur paiement");
      console.error("checkout/session:", data);
      return;
    }

    if (data?.url) {
      window.location.assign(data.url);
      return;
    }

    alert("Checkout: URL manquante");
    console.error("checkout/session:", data);
  }

  return (
<>
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header simple (on harmonisera ensuite au niveau global) */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="/" className="font-semibold text-slate-900">Site Sciences</a>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <a className="hover:text-slate-900" href="/">Accueil</a>
            <a className="hover:text-slate-900" href="/tarifs">Tarifs</a>
            <a className="hover:text-slate-900" href="/contact">Contact</a>
            <a className="hover:text-slate-900" href="/mon-compte">Mon compte</a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Progress (conversion) */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs text-slate-500">Parcours</div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-white">1 Tarifs</span>
            <span className="h-[2px] flex-1 bg-slate-200" />
            <span className="rounded-full bg-slate-900 px-3 py-1 text-white">2 Paiement</span>
            <span className="h-[2px] flex-1 bg-slate-200" />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">3 Confirmation</span>
          </div>
          <div className="mt-3 text-sm text-slate-600">Objectif : finaliser en 2 minutes. Paiement sécurisé.</div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Mon panier</h1>
          <p className="text-slate-600">Choisis ta formule, puis personnalise avec options / thèmes / modes.</p>
        </div>

        {/* Tabs */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-2">
          <div className="flex flex-wrap gap-2">
            {[
              { k: "subjects", label: "Matières par niveau" },
              { k: "themes", label: "Thèmes visuels" },
              { k: "learning", label: "Modes d’apprentissage" },
              { k: "chapters", label: "Achat par chapitre" },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k as any)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm transition",
                  tab === t.k ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

        {/*__SS_ADDONS_UI__*/}
        {tab === "themes" ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Skins (achat unique)</div>
              <div className="mt-1 text-sm text-slate-600">
                Un skin acheté est disponible définitivement. Prix: {money(SKIN_PRICE_ONE_TIME)} / skin.
              </div>

              <div className="mt-4 grid gap-4">
                {SKIN_GROUPS.map((group) => (
                  <div key={group} className="rounded-2xl border border-slate-200 p-4">
                    <div className="text-sm font-semibold">{group}</div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {SKIN_CATALOG.filter((x) => x.group === group).map((x) => (
                        <div key={x.key} className="rounded-xl border border-slate-200 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <button
                              className={cn(
                                "flex items-center gap-2 text-sm font-semibold",
                                activeSkin === x.key ? "text-slate-900" : "text-slate-700"
                              )}
                              onClick={() => setActiveSkin(x.key)}
                              type="button"
                            >
                              <SkinLogoSlot />
                              <span>{x.label}</span>
                            </button>

                            <label className="flex items-center gap-2 text-xs text-slate-600">
                              <input
                                type="checkbox"
                                checked={!!purchasedSkins[x.key]}
                                onChange={() => setPurchasedSkins((p) => ({ ...p, [x.key]: !p[x.key] }))}
                              />
                              Acheter ({money(SKIN_PRICE_ONE_TIME)})
                            </label>
                          </div>

                          <div className="mt-2 text-xs text-slate-500">
                            Actif: {activeSkin === x.key ? "oui" : "non"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Récap achat unique</div>
              <div className="mt-3 text-sm text-slate-700">
                Skins achetés:
                <div className="mt-1 text-slate-600">
                  {Object.entries(purchasedSkins)
                    .filter(([, v]) => v)
                    .map(([k]) => (SKIN_CATALOG.find((x) => x.key === k)?.label ?? k))
                    .join(", ") || "—"}
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-700">
                Total skins (unique): <span className="font-semibold">{money(skinsOneTime)}</span>
              </div>
            </aside>
          </div>
        ) : null}

        {tab === "learning" ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Modes d’apprentissage (abonnement)</div>
              <div className="mt-1 text-sm text-slate-600">
                {money(LEARNING_ADDON_PRICE_MONTHLY)} / mois / mode. Renouvellement mensuel (ou annuel si Annuel).
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {LEARNING_ADDONS.map((a) => (
                  <label key={a.key} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
                    <input
                      type="checkbox"
                      checked={!!selectedLearning[a.key]}
                      onChange={() => setSelectedLearning((p) => ({ ...p, [a.key]: !p[a.key] }))}
                    />
                    <div>
                      <div className="text-sm font-semibold">{a.label}</div>
                      <div className="text-xs text-slate-600">{a.desc}</div>
                    </div>
                    <div className="ml-auto text-sm font-semibold">{money(LEARNING_ADDON_PRICE_MONTHLY)}/mois</div>
                  </label>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Récap abonnement</div>
              <div className="mt-3 text-sm text-slate-700">
                Modes choisis:
                <div className="mt-1 text-slate-600">
                  {Object.entries(selectedLearning).filter(([,v]) => v).map(([k]) => k.toUpperCase()).join(", ") || "—"}
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-700">
                Total modes (€/mois): 
      {}
      <span className="font-semibold">{money(learningMonthly)}</span>
              </div>
            </aside>
          </div>
        ) : null}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="space-y-6">
            {/* Plan + durée */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Formule</div>
                  <select
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as Plan)}
                  >
                    <option value="normal">Normal</option>
<option value="gold">Gold</option>
                    <option value="platine">Platine</option></select>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Durée</div>
                  <select
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as Duration)}
                  >
                    <option value="monthly">Mensuel</option>
                    <option value="annual">Annuel (-20%)</option>
                  </select>
                </div>
              </div>

              {tab === "subjects" ? (
                <>
                  <p className="mt-4 text-sm text-slate-600">
                    Choisis <span className="font-semibold text-slate-900">niveau + matière</span> pour chaque abonnement.
                  </p>

                  <div className="mt-4 space-y-3">
                    {items.map((it) => (
                      <div
                        key={it.id}
                        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center"
                      >
                        <div className="flex flex-1 flex-col gap-3 md:flex-row">
                          <select
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm md:w-40"
                            value={it.level}
                            onChange={(e) => updateItem(it.id, { level: e.target.value })}
                          >
                            {LEVELS.map((l) => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>

                          <select
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                            value={it.subject}
                            onChange={(e) => updateItem(it.id, { subject: e.target.value })}
                          >
                            {SUBJECTS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => removeItem(it.id)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Retirer
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addItem}
                    className="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    + Ajouter une matière/niveau
                  </button>
                </>
              ) : (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Onglet <span className="font-semibold text-slate-900">“{tab}”</span> : (mock UI validé) — branchement plus tard.
                </div>
              )}
            </section>

            {/* Options */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">Options</h2>
              <div className="mt-4 grid gap-3">
                {UPSELLS.map((u) => {
                  const checked = !!__effectiveUpsells[u.key];
                  const isOwned = u.key === "parents" && owned.parentsOwned;
                  
// FIX_GLOBAL_RECAP_V1: fallback safe si globalRecap a été supprimé par patch
const globalRecap =
  (typeof tabRecap !== "undefined" && tabRecap && typeof tabRecap === "object")
    ? tabRecap
    : { title: "Récap général", lines: [] as any[] };

return (
                    <button
                      key={u.key}
                      onClick={() => toggleUpsell(u.key)}
                      className={cn(
                        "flex items-start justify-between gap-4 rounded-2xl border p-4 text-left transition",
                        isOwned ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      )}
                      aria-disabled={isOwned}
                    >
                      <div className="flex gap-3">
                        <div className={cn("mt-1 h-5 w-5 rounded-md border", checked ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white")} />
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{u.label}</div>
                            {isOwned ? (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                                Déjà acheté
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-1 text-sm text-slate-600">{u.desc}</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-700">{isOwned ? "Inclus" : `+ ${money(u.monthly)}/mois`}</div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right recap sticky */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Récap</div>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{PLAN_META[plan].label}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {items.length} sélection{items.length > 1 ? "s" : ""} • {duration === "annual" ? "Annuel (-20%)" : "Mensuel"}
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Thème {themePack} • Skin {activeSkin}</div>
                    {familyDiscountEligible ? (
                      <div className="mt-2 text-xs text-emerald-700">Pack Famille activé (-20%)</div>
                    ) : null}
                  </div>
                  <div className="text-lg font-semibold">
{bulkSameLevelActive ? (
  <div className="mt-2 flex items-center justify-between text-sm">
    <div className="text-slate-600">Remise matières (≥ 3 même niveau) (-10%)</div>
    <div className="font-semibold text-emerald-700">- {money(bulkSameLevelDiscountMonthlyValue)}</div>
  </div>
) : null}
{/*__SS_BULK_RECAP_LINE__*/}

{/*__SS_RIGHT_RECAP_UI__*/}
<div className="mt-4 grid gap-3">
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="text-xs text-slate-500">Récap onglet</div>
    <div className="mt-1 text-sm font-semibold text-slate-900">{tabRecap.title}</div>
    <div className="mt-3 space-y-2">
      {tabRecap.lines.map((l, idx) => (
        <div key={idx} className="flex items-start justify-between gap-3 text-sm">
          <div className="text-slate-600">{l.label}</div>
          {l.value ? <div className="text-right font-semibold text-slate-900">{l.value}</div> : <div />}
        </div>
      ))}
    </div>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="text-xs text-slate-500">Récap général</div>
    <div className="mt-1 text-sm font-semibold text-slate-900">{globalRecap.title}</div>

    <div className="mt-3 space-y-2">
      {globalRecap.lines.map((l, idx) => (
        <div key={idx} className="flex items-start justify-between gap-3 text-sm">
          <div className="text-slate-600">{l.label}</div>
          {l.value ? (
            <div
              className={
                "text-right font-semibold " +
                (l.tone === "good" ? "text-emerald-700" : l.tone === "bad" ? "text-slate-900" : "text-slate-900")
              }
            >
              {l.value}
            </div>
          ) : (
            <div />
          )}
        </div>
      ))}
    </div>

    <div className="mt-3 text-xs text-slate-500">

  Total abonnement = €/mois. Total aujourd’hui = (mensuel ou annuel) + achats uniques.
    </div>
  </div>
</div>

{money(totalMonthly)}
</div>
                </div>

                <div className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-600">
                  ✅ Accès immédiat • ✅ Résiliation simple • ✅ Support rapide
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
  <div className="text-xs text-slate-500">Total aujourd’hui</div>
  <div className="mt-1 flex items-baseline justify-between gap-3">
    <div className="text-sm text-slate-600">
      {duration === "annual" ? "Abonnement annuel (12 mois) + achats uniques" : "Abonnement mensuel + achats uniques"}
    </div>
    <div className="text-xl font-semibold">{money(totalDueToday)}</div>
  </div>
  <div className="mt-1 text-xs text-slate-500">
    Achats uniques (skins): {money(skinsOneTime)} — Options abonnement (modes): {money(learningMonthly)}/mois
  </div>
</div>

<button
                onClick={startStripeCheckout}
                className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Payer → Stripe
              </button>
{/* __SS_ADDONS_TOTALTODAY_UI__ */}

              <a className="mt-3 block text-center text-sm text-slate-600 hover:text-slate-900" href="/tarifs">
                ← Retour Tarifs
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
      {ParentPinModal}
  </>
  );
}
