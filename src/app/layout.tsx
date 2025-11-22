import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Geist_Mono, Inter } from 'next/font/google';

import './globals.css';

import { DottedBackground } from '@/components/eagle/dotted';
import { ReactScan } from '@/components/eagle/react-scan';
import { ThemeToggle } from '@/components/eagle/theme-toggle';
import { Toaster } from '@/components/eagle/toaster';

const interSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'psychiatrie regeln',
  icons: 'https://em-content.zobj.net/source/telegram/386/skull_1f480.webp',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${interSans.variable} antialiased tracking-tight lowercase font-sans cursor-default relative`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem>
          <div className='absolute top-4 right-4 z-50 pointer-events-auto'>
            <ThemeToggle />
          </div>

          <div className='fixed inset-0 -z-10'>
            <DottedBackground
              dotColor='var(--foreground)'
              className='opacity-45'
              spacing={28}
              dotSize={2}
            />
          </div>

          <div className='container mx-auto relative z-0'>
            {children}
          </div>
        </ThemeProvider>

        {/* Toast container: Wraps all toast notifications. Comment out if not needed. */}
        <Toaster />

        {/* Developer Component ( view fps + fps drops and rendering) */}
        <ReactScan />
      </body>
    </html>
  );
}
