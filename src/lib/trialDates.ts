export function computeTrialDates(now = new Date()) {
  const start = now;
  const end = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 jours
  return { start, end };
}
