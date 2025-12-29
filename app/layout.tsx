export const runtime = "nodejs";

import type { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import { Inter, Noto_Kufi_Arabic, Poppins } from 'next/font/google';
import { SiteBackground } from '@/components/SiteBackground';
import TelegramSupportButton from '@/components/TelegramSupportButton';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ['latin'], display: 'swap', variable: '--font-poppins' });
const notoKufi = Noto_Kufi_Arabic({ subsets: ['arabic'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-kufi' });

export const metadata: Metadata = {
  title: 'Premium Streaming for Live Sports & Series | TV For All',
  description: 'Watch NFL, NBA, MLB, NHL, top series, and movies with a premium live TV subscription. Fast US-focused streaming, instant activation, and secure crypto subscription checkout.',
  metadataBase: new URL('https://tvforall.store'),
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'Premium Streaming for Live Sports & Series | TV For All',
    description: 'Live sports streaming plus US series and movies. Instant activation, secure crypto subscriptions, and transparent pricing.',
    url: 'https://tvforall.store',
    siteName: 'TV For All',
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
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true, send_page_view: false });
              `}
            </Script>
          </>
        )}
        <SiteBackground />
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
        {children}
        <TelegramSupportButton />
      </body>
    </html>
  );
}
