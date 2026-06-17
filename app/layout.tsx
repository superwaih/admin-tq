import './globals.css';
import type { Metadata } from 'next';
import ThemeInit from '@/src/components/shared/ThemeInit';

const themeScript = `(function(){try{var t=localStorage.getItem('admitiq-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`;

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
      <head>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased bg-[#F6F7F9] dark:bg-[#0f1117] text-[#0F1117] dark:text-[#eef0f8]">
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
