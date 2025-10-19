import Header from "@/components/Header";
import Footer from "@/components/layout/Footer";
import { VisualThemeProvider } from "@/contexts/visualTheme";

import SessionGate from "../components/security/SessionGate";

import ActiveSubBannerServer from "../components/trial/ActiveSubBannerServer";

import FooterLegal from "../components/layout/FooterLegal";

import TrialBannerServer from "../components/trial/TrialBannerServer";
import type { Metadata } from 'next'
import './addons.css'
import './globals.css'
import LearningModeProvider from './_providers/LearningModeProvider'
import SelectionProviderClient from './_providers/SelectionProviderClient'
import { cookies } from 'next/headers'
import ClientVisualTheme from "@/app/ClientVisualTheme";

/* __DUP_METADATA_START__
export const metadata = {
  title: "Site Sciences — Révisions intelligentes",
  description: "Fiches, exercices et suivi d’assiduité. Essai gratuit 3 jours. Anti-partage: 1 session (2 avec Famille).",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Site Sciences",
    description: "Fiches, exercices, XP & badges. Essai 3 jours.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    type: "website",
  },
  robots: { index: true, follow: true },
} satisfies import('next').Metadata;


__DUP_METADATA_END__ */
export const metadata: Metadata = {
  title: 'Site Sciences',
  description: 'Apprentissages adaptés',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jar = await cookies()
  const skin = jar.get('skin_active')?.value || 'default'

  return (
    <html lang="fr" data-skin={skin} data-theme="light" suppressHydrationWarning>
      <body>
        <VisualThemeProvider>
        <ClientVisualTheme>
      <script dangerouslySetInnerHTML={{__html:`(function(){try{var v=localStorage.getItem("theme")||"light";document.documentElement.setAttribute("data-theme",v);}catch(e){}})();`}}></script>
      <SessionGate />
      <TrialBannerServer />
      <ActiveSubBannerServer />
        <LearningModeProvider>
          <SelectionProviderClient>
            <Header />
            <main className="min-h-dvh"><ClientVisualTheme>{children}</ClientVisualTheme></main>
          </SelectionProviderClient>
        </LearningModeProvider>
            </ClientVisualTheme>
        <Footer />
    </VisualThemeProvider>
      </body>
    </html>
  )
}
