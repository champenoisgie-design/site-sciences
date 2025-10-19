// src/app/prof/page.tsx
import { getSessionUser } from "@/lib/auth";
import { hasTeacherMode, getClassSummary } from "@/lib/teacher";
import EnableTeacherButton from "@/components/prof/EnableTeacherButton";
import AddStudentForm from "@/components/prof/AddStudentForm";

export const dynamic = "force-dynamic";

export default async function ProfPage() {
  const user = await getSessionUser().catch(()=>null);
  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Espace Professeur</h1>
        <p className="mt-2">Veuillez vous connecter.</p>
      </main>
    );
  }

  const enabled = await hasTeacherMode(user.id);
  const cls = enabled ? await getClassSummary(user.id) : [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Espace Professeur</h1>
      {!enabled ? (
        <div className="mt-4 rounded-xl border p-4 bg-white">
          <div className="font-semibold">Activer l'accès</div>
          <p className="mt-1 text-sm text-gray-600">
            Votre email doit être dans <code>TEACHER_ALLOWLIST</code> (CSV). Sinon, une demande est envoyée à l’admin.
          </p>
          <div className="mt-2"><EnableTeacherButton /></div>
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
          <div className="rounded-xl border p-4 bg-white">
            <div className="font-semibold">Ma classe</div>
            <p className="mt-1 text-sm text-gray-600">Ajoutez des élèves par email ou userId, puis consultez l’activité 14j, le streak et les badges.</p>
            <AddStudentForm onAdded={()=>{}} />
          </div>
          <div className="rounded-xl border p-4 bg-white">
            <div className="font-semibold">Suivi des élèves</div>
            <div className="mt-3 grid gap-3">
              {cls.length===0 && <div className="text-sm text-gray-600">Aucun élève pour le moment.</div>}
              {cls.map((s:any, i:number)=>(
                <div key={i} className="rounded border p-3">
                  <div className="font-semibold">Élève: {s.userId}</div>
                  <div className="mt-1 text-sm">Activités (14j): <strong>{s.total}</strong></div>
                  <div className="mt-1 text-sm">Streak: <strong>{s.streak?.current ?? 0}</strong> (best {s.streak?.best ?? 0})</div>
                  <div className="mt-1 text-sm">Badges: {s.badges.length ? s.badges.map((b:any)=> <span key={b.id} className="mr-2 text-xs px-1.5 py-0.5 border rounded">{b.badgeKey}</span>) : <em>aucun</em>}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
