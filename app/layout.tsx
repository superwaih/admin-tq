import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AdmitIQ — Your AI-Powered Admissions Co-Pilot',
  description:
    'Get your exact acceptance probability, AI-crafted essays, MMI practice, and personalized strategy. Canadian universities — built for Grade 12.',
  keywords: [
    'Canadian university admissions',
    'OUAC',
    'university application',
    'admissions simulator',
    'MMI practice',
  ],
  authors: [{ name: 'AdmitIQ Team' }],
  creator: 'AdmitIQ',
  publisher: 'AdmitIQ',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'AdmitIQ — Your AI-Powered Admissions Co-Pilot',
    description: 'Get your exact acceptance probability, AI-crafted essays, MMI practice, and personalized strategy.',
    type: 'website',
    locale: 'en_CA',
    siteName: 'AdmitIQ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AdmitIQ — Your AI-Powered Admissions Co-Pilot',
    description: 'Get your exact acceptance probability, AI-crafted essays, MMI practice, and personalized strategy.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#0a0c13]">{children}</body>
    </html>
  );
}
