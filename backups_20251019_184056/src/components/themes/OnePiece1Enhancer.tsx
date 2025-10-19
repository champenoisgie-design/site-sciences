'use client'
import { useEffect, useState } from 'react'
import '@/styles/onepiece1.css'

/** Applique les classes CSS qui blanchissent le texte du héros quand le thème est actif. */
export default function OnePiece1Enhancer() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    const check = () =>
      setActive(html.getAttribute('data-theme') === 'onepiece1')
    check()
    const mo = new MutationObserver(check)
    mo.observe(html, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return

    // Scope autour du H1
    const h1 = Array.from(document.querySelectorAll('h1')).find((n) =>
      n.textContent?.toLowerCase().includes('apprendre plus vite'),
    )
    const leftScope = h1?.closest<HTMLElement>('section,div,article,main')
    leftScope?.classList.add('preview-hero-scope')

    // Phrase "Le contenu s’adapte à ton niveau…"
    const needles = [
      'le contenu s’adapte à ton niveau',
      'le contenu s adapte a ton niveau',
    ]
    const phraseTargets = Array.from(
      document.querySelectorAll('p,div,span'),
    ).filter((el) => {
      const t = (el.textContent || '').toLowerCase()
      return needles.some((n) => t.includes(n))
    })
    phraseTargets.forEach((el) => {
      el.classList.add('hero-intro-force')
      el.closest<HTMLElement>('section,div,article,main')?.classList.add(
        'preview-hero-scope',
      )
    })

    // Liste de puces (✔️ …)
    const bullets = Array.from(document.querySelectorAll('ul,ol')).find(
      (ul) => {
        const t = (ul.textContent || '').toLowerCase()
        return (
          t.includes('exercices interactifs') ||
          t.includes('progression par chapitre') ||
          t.includes('multi-joueur') ||
          t.includes('tdah') ||
          t.includes('mode famille')
        )
      },
    )
    if (bullets) {
      bullets.classList.add('hero-bullets')
      bullets.parentElement?.classList.add('hero-bullets')
      bullets
        .closest<HTMLElement>('section,div,article,main')
        ?.classList.add('preview-hero-scope')
    }

    // Champ e-mail + lien "Me connecter"
    const email = document.querySelector<HTMLInputElement>(
      'input[type="email"], input[placeholder*="mail" i]',
    )
    email?.classList.add('hero-email')
    email
      ?.closest<HTMLElement>('section,div,form')
      ?.classList.add('preview-hero-scope')

    const login = Array.from(document.querySelectorAll('a')).find((a) =>
      (a.textContent || '').toLowerCase().includes('me connecter'),
    )
    login?.classList.add('hero-link')
  }, [active])

  return null
}
