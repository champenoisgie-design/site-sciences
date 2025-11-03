import PanierTabs from "@/components/cart/PanierTabs";
import TryBeforeMount from "@/components/cart/TryBeforeMount";

export const metadata = { title: "Mon panier — Site Sciences" };

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">🧺 Mon panier</h1>
        <p className="text-gray-600 mb-6">
          Multi-onglets : matières, thèmes (démo), modes d’apprentissage, chapitres.
        </p>
        <PanierTabs />
      </div>
      <footer className="mt-16 py-10 text-center text-gray-500 text-sm">
        © 2025 coursmathsphysiqueconcret.com
      </footer>
    </main>
  );
}
