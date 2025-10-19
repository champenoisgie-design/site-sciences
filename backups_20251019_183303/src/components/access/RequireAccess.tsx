// src/components/access/RequireAccess.tsx
import { getSessionUser } from "../../lib/auth";
import { getAccessInfo } from "../../lib/access";
import { redirect } from "next/navigation";

export default async function RequireAccess({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser().catch(() => null);
  if (!user) {
    redirect("/login?next=%2Fcours");
  }
  const info = await getAccessInfo(user!.id);
  if (!info.hasAccess) {
    redirect("/panier?access=denied");
  }
  return <>{children}</>;
}
