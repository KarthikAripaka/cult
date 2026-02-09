import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: {
    default: 'CULT | Premium Fashion',
    template: '%s | CULT',
  },
  description: 'Discover the finest luxury fashion pieces. Shop premium clothing, accessories, and more. Free shipping on orders above ₹2000.',
  keywords: ['fashion', 'luxury', 'premium clothing', 'designer wear', 'online shopping', 'Indian fashion', 'men fashion', 'women fashion'],
  authors: [{ name: 'CULT' }],
  creator: 'CULT',
  publisher: 'CULT',
  metadataBase: new URL('https://cult.fashion'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CULT | Premium Fashion',
    description: 'Discover the finest luxury fashion pieces.',
    url: 'https://cult.fashion',
    siteName: 'CULT',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://cult.fashion/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CULT - Premium Fashion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CULT | Premium Fashion',
    description: 'Discover the finest luxury fashion pieces.',
    site: '@cult',
    creator: '@cult',
    images: ['https://cult.fashion/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
