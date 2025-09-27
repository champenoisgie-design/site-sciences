"use client"
import { ModeProvider } from '@/components/ModeProvider'
import { SelectionProvider } from '@/components/SelectionProvider'
import ThemeBackground from '@/components/ThemeBackground'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ModeProvider>
      <SelectionProvider>
        <ThemeBackground />
        {children}
      </SelectionProvider>
    </ModeProvider>
  )
}
