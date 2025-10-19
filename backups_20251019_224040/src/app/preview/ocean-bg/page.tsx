"use client";

export default function OceanBgPreview() {
  return (
    <main className="relative min-h-screen">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 h-full w-full object-cover -z-10"
      >
        <source src="/ocean_loop_8s.mp4" type="video/mp4" />
      </video>

      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-28 pb-24 text-white">
        <h1 className="mb-3 text-4xl font-extrabold drop-shadow">
          Apprendre plus vite, progresser sereinement
        </h1>
        <p className="mb-6 max-w-2xl text-white/90 drop-shadow">
          Exemple de fond animé (mer, bateau, vent). Page de preview, aucun impact sur la home.
        </p>
        <a
          href="/"
          className="inline-block rounded-xl bg-white/90 px-5 py-2 font-medium text-gray-900 hover:bg-white"
        >
          Retour à l’accueil
        </a>
      </section>
    </main>
  );
}
