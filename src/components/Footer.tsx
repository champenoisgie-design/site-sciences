export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-zinc-500 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          © {new Date().getFullYear()} Site Sciences — Tous droits réservés
        </div>
        <nav className="flex flex-wrap gap-3">
          <a href="/cgu" className="hover:underline">
            CGU
          </a>
          <a href="/confidentialite" className="hover:underline">
            Confidentialité
          </a>
          <a href="/mentions-legales" className="hover:underline">
            Mentions légales
          </a>
          <a href="/cookies" className="hover:underline">
            Cookies
          </a>
        </nav>
      </div>
    </footer>
  )
}
