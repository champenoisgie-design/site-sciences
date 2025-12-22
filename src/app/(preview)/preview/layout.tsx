import type { ReactNode } from "react";

/**
 * Layout PREVIEW
 * - volontairement DARK ONLY
 * - indépendant du thème clair/sombre du vrai site
 */
export default function PreviewLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
