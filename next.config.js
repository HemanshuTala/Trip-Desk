/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensures Next.js runs in SSR/server mode (not static export).
  // This is required for Netlify to use @netlify/plugin-nextjs correctly
  // and prevents the "noindex.html" fallback page from being served.
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
