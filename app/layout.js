import './globals.css'
import { Inter } from 'next/font/google'
import { StoreProvider } from '@/lib/store/store-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ArtAgent - 智能艺术创作平台',
  description: '利用 AI 技术，激发你的艺术灵感，创作独特作品',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={`min-h-screen bg-background ${inter.className}`} suppressHydrationWarning>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
