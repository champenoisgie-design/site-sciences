import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Site Sciences',
  description: 'Ressources, tutoriels et entraînements adaptés à ton niveau.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          <footer className="border-t mt-10 py-6 text-center text-sm text-zinc-500">
            © 2025 Site Sciences — Tous droits réservés
            <div className="mt-2 flex justify-center gap-4">
              <a href="/cgu">CGU</a>
              <a href="/confidentialite">Confidentialité</a>
              <a href="/mentions-legales">Mentions légales</a>
              <a href="/cookies">Cookies</a>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
