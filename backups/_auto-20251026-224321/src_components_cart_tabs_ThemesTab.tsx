"use client";
import { CartState } from "../PanierTabs";

const CARDS = [
  { title: "One Piece 1", video: "/themes/onepiece/onepiece1.mp4", poster: "/themes/onepiece/onepiece1.jpg", link: "/themes/onepiece" },
  { title: "One Piece 4", video: "/themes/onepiece/onepiece4.mp4", poster: "/themes/onepiece/onepiece4.jpg", link: "/themes/onepiece" },
  { title: "Mario 1",      video: "/themes/mario/mario1.mp4",       poster: "/themes/mario/mario1.jpg",       link: "/themes/mario" },
];

export default function ThemesTab({
  value, onChange
}: { value: CartState; onChange: (v: CartState) => void }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {CARDS.map((c) => (
        <div key={c.title} className="rounded-xl border border-gray-200 bg-white p-3">
          <h3 className="font-medium mb-2 text-gray-900">{c.title}</h3>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video muted playsInline autoPlay loop preload="metadata" loading="lazy" className="w-full h-full object-cover"
              className="w-full h-full object-cover"
              poster={c.poster}
              preload="metadata"
              autoPlay
              muted
              loop
              playsInline
              controls
            >
              <source src={c.video} type="video/mp4" />
            </video>
          </div>
          <div className="flex justify-between items-center mt-2">
            <a href={c.link} className="text-sm text-gray-700 hover:text-gray-900 underline underline-offset-4">
              Voir le thème →
            </a>
            <button
              className="text-sm px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50"
              onClick={() => alert("Demo lancée ✅")}
            >
              Essayer avant d’acheter
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
