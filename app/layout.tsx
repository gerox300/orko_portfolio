import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { TextureOverlay } from '@/components/TextureOverlay';
import localFont from 'next/font/local';

// ─── FONTS ────────────────────────────────────────────────────────────────────

const headlineFont = localFont({
  src: '../public/hs_lunaobscura/HS_LunaObscura.woff2',
  variable: '--font-headline',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

import { Unbounded } from 'next/font/google';

const unbounded = Unbounded({
  variable: '--font-unbounded',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
});

// ─── METADATA ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'orko_ — Digital Mutation Laboratory',
  description:
    'We incubate living identities and high-performance interfaces. Brand systems, intelligent platforms, and autonomous digital organisms.',
  openGraph: {
    title: 'orko_ — Digital Mutation Laboratory',
    description:
      'We incubate living identities and high-performance interfaces. Brand systems, intelligent platforms, and autonomous digital organisms.',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // {/* ASSET: OG_IMAGE | REPLACE_WITH: 1200x630 .png social share card — dark, branded */}
        width: 1200,
        height: 630,
        alt: 'orko_ — Digital Mutation Laboratory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'orko_ — Digital Mutation Laboratory',
    description:
      'We incubate living identities and high-performance interfaces.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico', // {/* ASSET: FAVICON | REPLACE_WITH: .ico or .svg — [K_O] mark in infrared red on black */}
  },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

// ─── ROOT LAYOUT ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headlineFont.variable} ${jetbrainsMono.variable} ${unbounded.variable}`}
    >
      <body suppressHydrationWarning>
        {/* Skip to content for keyboard navigation */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        {/* Providers: Lenis, Cursor, Audio, Language, GlitchEngine */}
        <Providers>
          {/* Fixed noise grain + scanlines overlay — always on top */}
          <TextureOverlay />
          {children}
        </Providers>
      </body>
    </html>
  );
}
