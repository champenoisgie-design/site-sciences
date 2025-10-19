import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs | Site Sciences',
  description: 'Formules adaptées par niveau et matière, avec remises.',
}

export default function TarifsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
