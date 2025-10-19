import { hasGlobalAccess } from "./subscription";

export async function canAccessChapter(opts: {
  userId: string;
  learningMode: "normal"|"tdah"|"dys";
  subject: string;
  level: string;
  chapterKey: string;
}) {
  // Pour l’instant: seul l’abonnement global active l’accès.
  return hasGlobalAccess(opts.userId, opts.learningMode);
}
