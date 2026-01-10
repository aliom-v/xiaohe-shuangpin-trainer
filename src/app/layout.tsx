import type { Metadata, Viewport } from 'next'
import './globals.css'
import WebVitals from '@/components/WebVitals'

export const metadata: Metadata = {
  title: '小鹤双拼练习器 - 在线学习双拼输入法',
  description: '免费在线小鹤双拼练习工具，支持可视化键盘、实时提示、打字音效、专项练习、统计分析等功能，帮助你快速掌握小鹤双拼输入法。',
  keywords: ['双拼', '小鹤双拼', '打字练习', '拼音输入法', '键盘练习', '双拼教程', '双拼学习'],
  authors: [{ name: 'Xiaohe Shuangpin Trainer' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '双拼练习',
  },
  openGraph: {
    title: '小鹤双拼练习器',
    description: '免费在线小鹤双拼练习工具，帮助你快速掌握双拼输入法',
    type: 'website',
    locale: 'zh_CN',
    siteName: '小鹤双拼练习器',
  },
  twitter: {
    card: 'summary',
    title: '小鹤双拼练习器',
    description: '免费在线小鹤双拼练习工具，帮助你快速掌握双拼输入法',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        {children}
        <WebVitals />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered'))
                    .catch(err => console.log('SW registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
