import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cours MP Concret',
  description: 'Exercices corrigés, tutoriels vidéo et sessions live.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="light">
      <body>{children}</body>
    </html>
  )
}
