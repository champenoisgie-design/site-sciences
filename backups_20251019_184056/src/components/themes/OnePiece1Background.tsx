'use client'
import { useEffect, useState } from 'react'

/** Affiche la vidéo + voile uniquement si <html data-theme="onepiece1"> */
export default function OnePiece1Background() {
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
  if (!active) return null

  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 -z-10 h-full w-full object-cover"
      >
        <source src="/onepiece3.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-black/70 via-black/45 to-transparent" />
      </div>
    </>
  )
}
