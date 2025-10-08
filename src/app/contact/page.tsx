import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact — Site Sciences" };

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Contact</h1>
      <form method="POST" action="/api/contact" className="grid gap-4">
        <label className="grid gap-2">
          <span>Votre e-mail</span>
          <input required name="email" type="email" className="rounded border px-3 py-2" />
        </label>
        <label className="grid gap-2">
          <span>Message</span>
          <textarea required name="message" rows={6} className="rounded border px-3 py-2"></textarea>
        </label>
        <button className="rounded-xl border px-4 py-2 font-semibold">Envoyer</button>
      </form>
      <p className="mt-4 text-sm opacity-70">En envoyant, vous acceptez nos <a className="underline" href="/cgu">CGU</a> et notre <a className="underline" href="/confidentialite">Politique de Confidentialité</a>.</p>
    </main>
  );
}
