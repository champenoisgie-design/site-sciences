// src/app/providers.tsx
"use client";

import React from "react";
import { ModeProvider } from "@/components/ModeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ModeProvider>{children}</ModeProvider>;
}
