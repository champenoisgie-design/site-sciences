"use client";
import type React from "react";
import { ModeProvider } from "@/components/ModeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ModeProvider>{children}</ModeProvider>;
}
