// src/components/layout/FooterLegal.tsx
import Link from "next/link";

export default function FooterLegal() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} Site Sciences</div>
        <nav className="flex items-center gap-4">
          <Link href="/(legal)/cgu" className="underline">CGU</Link>
          <Link href="/(legal)/confidentialite" className="underline">Confidentialité</Link>
          <Link href="/(legal)/mentions" className="underline">Mentions légales</Link>
          <Link href="/faq" className="underline">FAQ</Link>
        </nav>
      </div>
    </footer>
  );
}
