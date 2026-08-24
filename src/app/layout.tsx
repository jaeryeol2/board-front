import { ChildrenType } from '@/types/base';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'The Lounge.',
  description: 'All the information in the world is here.',
};

export default function RootLayout({ children }: Readonly<ChildrenType>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f5f5f7] text-[#1d1d1f] min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
