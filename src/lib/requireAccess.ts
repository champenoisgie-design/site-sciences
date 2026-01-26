import { getAccessState, isAllowedForTrial } from "./accessControl";

export class HttpError extends Error {
  status: number;
  body: any;
  constructor(status: number, body: any) {
    super(body?.error || "HTTP_ERROR");
    this.status = status;
    this.body = body;
  }
}

export function jsonError(e: any) {
  if (e instanceof HttpError) {
    return Response.json(e.body, { status: e.status });
  }
  console.error(e);
  return Response.json({ error: "INTERNAL_ERROR" }, { status: 500 });
}

/**
 * Enforce accès serveur.
 * - FULL: OK
 * - TRIAL: OK seulement sur le scope (grade+subject) si requested fourni
 * - PAYWALL: 402
 */
export function requireAccess(
  user: any,
  requested?: { grade: string; subject: string }
) {
  const state = getAccessState(user);

  if (state.kind === "FULL") return;

  if (state.kind === "TRIAL") {
    if (!requested) return; // endpoints "généraux" autorisés pendant trial
    const ok = isAllowedForTrial({
      trialGrade: state.grade,
      trialSubject: state.subject,
      requestedGrade: requested.grade,
      requestedSubject: requested.subject,
    });
    if (ok) return;

    throw new HttpError(403, { error: "TRIAL_SCOPE_FORBIDDEN" });
  }

  throw new HttpError(402, { error: "PAYWALL_REQUIRED" });
}
