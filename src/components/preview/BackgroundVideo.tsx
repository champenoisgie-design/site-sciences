"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function BackgroundVideo() {
  const sp = useSearchParams();
  const demo = sp?.get("demo") || "";
  const src = demo ? `/themes/${demo}/preview.mp4` : `/intro.mp4`;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <video
        key={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        poster="/poster.jpg"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/35" />
    </div>
  );
}
