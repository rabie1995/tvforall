export const runtime = "nodejs";

import type { Metadata } from 'next';
import { Inter, Noto_Kufi_Arabic, Poppins } from 'next/font/google';
import { SiteBackground } from '@/components/SiteBackground';
import TelegramSupportButton from '@/components/TelegramSupportButton';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ['latin'], display: 'swap', variable: '--font-poppins' });
const notoKufi = Noto_Kufi_Arabic({ subsets: ['arabic'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-kufi' });

export const metadata: Metadata = {
  title: 'tv for all | Premium IPTV Subscriptions',
  description: 'Secure, fast IPTV streaming with 24/7 support. Pay with USDT and start watching instantly.',
  metadataBase: new URL('https://tvforall.store'),
  openGraph: {
    title: 'tvforall.store | Premium IPTV Subscriptions',
    description: 'Choose your plan, pay in USDT, and start watching securely.',
    url: 'https://tvforall.store',
    siteName: 'tvforall.store',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1527443224154-d8c2fc36c66a',
        width: 1200,
        height: 630,
        alt: 'Living room with TV'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  alternates: {
    canonical: 'https://tvforall.store'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${notoKufi.variable}`} suppressHydrationWarning>
      <body className="bg-surface text-navy antialiased">
        <SiteBackground />
        {children}
        <TelegramSupportButton />
      </body>
    </html>
  );
}
