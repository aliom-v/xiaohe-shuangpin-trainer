import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '小鹤双拼练习器',
  description: 'Xiaohe Shuangpin Trainer - 在线练习小鹤双拼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
