import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-16 py-8 text-sm">
      <div className="mx-auto max-w-5xl px-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="opacity-70">© {new Date().getFullYear()} coursmathsphysiqueconcret.com</p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/cga" className="hover:underline">CGA</Link>
          <Link href="/cgu" className="hover:underline">CGU</Link>
          <Link href="/confidentialite" className="hover:underline">Confidentialité</Link>
          <Link href="/mentions-legales" className="hover:underline">Mentions légales</Link>
          <Link href="/cookies" className="hover:underline">Cookies</Link>
        </nav>
      </div>
    </footer>
  );
}
