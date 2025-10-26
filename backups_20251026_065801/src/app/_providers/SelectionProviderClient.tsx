'use client'

import { SelectionProvider } from '@/components/SelectionProvider'

export default function SelectionProviderClient({
  children,
}: {
  children: React.ReactNode
}) {
  return <SelectionProvider>{children}</SelectionProvider>
}
