/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'liblibai-tmp-image.liblib.cloud',
        port: '',
        pathname: '/img/**',
      },
    ],
  },
}

module.exports = nextConfig
