/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用严格模式
  reactStrictMode: true,

  // 启用压缩
  compress: true,

  // 图片优化（PWA离线需要）
  images: {
    unoptimized: true,
  },

  // Service Worker 相关 headers
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
