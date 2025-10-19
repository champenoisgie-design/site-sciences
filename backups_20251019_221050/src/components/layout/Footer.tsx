export default function Footer() {
  return (
    <footer className="border-t mt-16 py-8 text-sm">
      <div className="mx-auto max-w-5xl px-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="opacity-70">© {new Date().getFullYear()} coursmathsphysiqueconcret.com</p>
        <nav className="flex flex-wrap gap-4">
          <a href="/cga" className="hover:underline">CGA</a>
          <a href="/cgu" className="hover:underline">CGU</a>
          <a href="/confidentialite" className="hover:underline">Confidentialité</a>
          <a href="/mentions-legales" className="hover:underline">Mentions légales</a>
          <a href="/cookies" className="hover:underline">Cookies</a>
        </nav>
      </div>
    </footer>
  );
}
