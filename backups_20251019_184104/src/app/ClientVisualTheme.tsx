"use client";
import React from "react";
import { VisualThemeProvider } from "@/contexts/visualTheme";
import VisualThemeBackground from "@/components/theme/VisualThemeBackground";

export default function ClientVisualTheme({ children }: { children: React.ReactNode }) {
  return (
    <VisualThemeProvider>
      <VisualThemeBackground />
      {children}
    </VisualThemeProvider>
  );
}
