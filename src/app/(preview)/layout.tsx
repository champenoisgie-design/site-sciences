import React from "react";
import BackgroundVideo from "@/components/preview/BackgroundVideo";

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundVideo />
      {children}
    </>
  );
}
