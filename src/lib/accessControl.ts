export type AccessState =
  | { kind: "FULL" }
  | { kind: "TRIAL"; grade: string; subject: string; endsAt: Date }
  | { kind: "PAYWALL" };

/**
 * Source de vérité côté serveur.
 * - abonnement actif => FULL
 * - trial actif (cohérent) => TRIAL
 * - sinon => PAYWALL
 *
 * NOTE: on se base sur subscriptionStatus si présent.
 * Si ton projet a une autre source (ex: table Subscription), on branchera ensuite.
 */
export function getAccessState(user: any): AccessState {
  if (user?.subscriptionStatus === "active") return { kind: "FULL" };

  const start = user?.trialStartAt ? new Date(user.trialStartAt) : null;
  const end = user?.trialEndsAt ? new Date(user.trialEndsAt) : null;
  const grade = typeof user?.trialGrade === "string" ? user.trialGrade : null;
  const subject = typeof user?.trialSubject === "string" ? user.trialSubject : null;

  if (start && end && grade && subject) {
    const now = new Date();
    if (now < end) return { kind: "TRIAL", grade, subject, endsAt: end };
  }

  return { kind: "PAYWALL" };
}

export function isAllowedForTrial(params: {
  trialGrade: string;
  trialSubject: string;
  requestedGrade: string;
  requestedSubject: string;
}) {
  return (
    params.trialGrade === params.requestedGrade &&
    params.trialSubject === params.requestedSubject
  );
}
