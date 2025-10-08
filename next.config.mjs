/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/tarifs/mode-d-apprentissage&mode=:mode',
        destination: '/tarifs/mode-d-apprentissage/:mode',
        permanent: false,
      },
    ]
  },
}
export default nextConfig
