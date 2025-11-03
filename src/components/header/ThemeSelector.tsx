"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Props = { alignLeft?: boolean };

export default function ThemeSelector({ alignLeft = true }: Props) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div
      ref={boxRef}
      data-injected-theme-selector
      className="relative"
      style={{ zIndex: 50 }}
    >
      <button
        type="button"
        className="pill px-3 py-1"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        🎨 Thème
      </button>

      {open && (
        <div
          role="menu"
          className="absolute mt-2 w-44 rounded-xl border bg-white text-sm shadow-lg"
          style={{ [alignLeft ? "left" : "right"]: 0 } as React.CSSProperties}
        >
          <div className="p-2">
            <Link role="menuitem" className="block rounded-lg px-3 py-2 hover:bg-gray-100" href="/themes/mario">
              Mario
            </Link>
            <Link role="menuitem" className="block rounded-lg px-3 py-2 hover:bg-gray-100" href="/themes/onepiece">
              One Piece
            </Link>
            <div className="my-2 border-t" />
            <Link role="menuitem" className="block rounded-lg px-3 py-2 hover:bg-gray-100" href="/preview/accueil?demo=mario">
              Essayer Mario
            </Link>
            <Link role="menuitem" className="block rounded-lg px-3 py-2 hover:bg-gray-100" href="/preview/accueil?demo=onepiece">
              Essayer One Piece
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
