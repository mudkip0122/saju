import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Gowun_Batang, Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
})

const gowunBatang = Gowun_Batang({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-gowun-batang',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Astra Destiny · AI 운세 분석',
  description:
    '고대 사주의 지혜와 AI의 섬세한 분석으로 나만의 성향과 오늘을 위한 방향을 발견해보세요.',
  applicationName: 'Astra Destiny',
  openGraph: {
    title: 'Astra Destiny · AI 운세 분석',
    description: '우주의 데이터로 읽는 당신의 운명. 회원가입 없이 나만의 오늘을 만나보세요.',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Astra Destiny — 우주의 데이터로 읽는 당신의 운명' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Astra Destiny · AI 운세 분석',
    description: '우주의 데이터로 읽는 당신의 운명.',
    images: ['/og.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8f9ff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${gowunBatang.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
