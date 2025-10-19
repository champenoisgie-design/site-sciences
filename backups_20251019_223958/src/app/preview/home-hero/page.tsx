import dynamic from "next/dynamic";
import MiniBanner from "@/components/marketing/MiniBanner";

// On importe ta Home "server" sans la modifier.
// On passe par dynamic(() => import...), pour éviter les warnings RSC dans la preview.
const Home = dynamic(() => import("@/app/page").then(m => m.default), { ssr: true });

export const metadata = { title: "Preview — Home avec bandeau" };

export default function PreviewHomeHero() {
  return (
    <>
      {/* Bandeau marketing au-dessus des blocs */}
      <MiniBanner />
      {/* La home actuelle, inchangée */}
      <Home />
    </>
  );
}
