import './globals.css'
import type { Metadata } from 'next'
import ThemeProvider from '@/components/ThemeProvider'
import ModeProvider from '@/components/ModeProvider'

export const metadata: Metadata = {
  title: 'Cours MP Concret',
  description: 'Exercices corrigés, tutos vidéo, live – avec modes TDAH, DYS, TSA, HPI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider>
          <ModeProvider>
            {children}
          </ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
