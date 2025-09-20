import './globals.css'
import type { Metadata } from 'next'
import ModeProvider from '@/components/ModeProvider'

export const metadata: Metadata = {
  title: 'Cours MP Concret',
  description: 'Exercices, tutoriels et live adaptés TDAH/DYS/TSA/HPI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ModeProvider>
          {children}
        </ModeProvider>
      </body>
    </html>
  )
}
