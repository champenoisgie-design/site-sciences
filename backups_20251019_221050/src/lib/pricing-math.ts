/**
 * Déduit un nombre de matières à partir d'un contexte souple (selectedSubjects, selected.subjects, etc.)
 * et applique:
 *  - si packs [{min,max,priceCents}] → choisit le palier correspondant
 *  - sinon → multiplie baseCents par le nombre de matières (min 1)
 */
export function applySubjectsCount(baseCents: number, packs?: any[] | null, ctx?: any): number {
  try {
    const v =
      ctx?.selectedSubjects ??
      ctx?.selected?.subjects ??
      ctx?.subjects ??
      null;

    const n =
      Array.isArray(v) ? v.length :
      (v && typeof v.size === "number") ? Number(v.size) :
      (v && typeof v.length === "number") ? Number(v.length) :
      1;

    const count = Math.max(1, Number.isFinite(n) ? Number(n) : 1);

    if (Array.isArray(packs) && packs.length) {
      const hit = packs.find((pk: any) => {
        const min = Number(pk.min ?? pk.minSubjects ?? 1);
        const max = Number(pk.max ?? pk.maxSubjects ?? min);
        return count >= min && count <= max;
      });
      if (hit && typeof hit.priceCents === "number") {
        return Number(hit.priceCents);
      }
    }

    return Math.round(Number(baseCents || 0) * count);
  } catch {
    return Math.round(Number(baseCents || 0));
  }
}
