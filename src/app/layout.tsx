import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SnowEffect } from '@/components/app/snow-effect';
import './snow.css';

export const metadata: Metadata = {
  title: 'Tamil Pasanga Hub',
  description: 'Great Experience, We Believe In Quality Not Quantity',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SnowEffect />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
