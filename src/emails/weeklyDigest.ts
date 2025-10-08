export function weeklyDigestTemplate(params: {
  parentName?: string | null;
  studentName?: string | null;
  activityCount14d: number;
  streakCurrent: number;
  badges: { badgeKey: string; earnedAt: Date }[];
}) {
  const { parentName, studentName, activityCount14d, streakCurrent, badges } = params;
  const badgeList = badges.length
    ? `<ul>${badges.map(b => `<li>${b.badgeKey} — ${new Date(b.earnedAt).toLocaleDateString()}</li>`).join("")}</ul>`
    : `<p>Aucun nouveau badge cette semaine.</p>`;
  return {
    subject: `Résumé hebdo — ${studentName || "Votre enfant"}`,
    html: `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
        <h2>Résumé hebdomadaire</h2>
        <p>${parentName ? `Bonjour ${parentName},` : "Bonjour,"}</p>
        <p>Activités (14 jours) : <b>${activityCount14d}</b></p>
        <p>Streak courant : <b>${streakCurrent}</b></p>
        <h3>Badges récents</h3>
        ${badgeList}
      </div>
    `,
    text: `Résumé hebdo\nActivités (14j): ${activityCount14d}\nStreak: ${streakCurrent}\nBadges: ${badges.map(b=>b.badgeKey).join(", ") || "aucun"}`,
  };
}
