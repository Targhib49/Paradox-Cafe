import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Paradox Cafe - The AI Persona Gaming Experience',
  description: 'Play classic games with AI personas that remember you, learn from you, and develop unique relationships. Created by Blackjet Dev.',
  keywords: ['AI gaming', 'Paradox Cafe', 'AI personas', 'Blackjet Dev', 'intelligent gaming', 'adaptive AI'],
  authors: [{ name: 'Blackjet Dev', url: 'https://paradox-cafe.vercel.app' }],
  creator: 'Blackjet Dev',
  publisher: 'Blackjet Dev',
  metadataBase: new URL('https://paradox-cafe.vercel.app'),
  openGraph: {
    title: 'Paradox Cafe - The AI Persona Gaming Experience',
    description: 'Play with AI personas that remember and adapt to you',
    url: 'https://paradox-cafe.vercel.app',
    siteName: 'Paradox Cafe',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paradox Cafe - The AI Persona Gaming Experience',
    description: 'Play with AI personas that remember and adapt to you',
    creator: '@blackjetdev',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}