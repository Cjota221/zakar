import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // next-pwa usa webpack; build usa --webpack flag (ver package.json)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

export default nextConfig
