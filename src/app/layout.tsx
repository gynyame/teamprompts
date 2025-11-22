import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'TeamPrompts - Team Prompt Library for AI Workflows',
    template: '%s | TeamPrompts'
  },
  description: 'Stop losing your team\'s best AI prompts. Build a searchable, shareable library with version control and usage analytics.',
  keywords: ['AI prompts', 'team collaboration', 'prompt management', 'ChatGPT', 'Claude', 'prompt library'],
  authors: [{ name: 'TeamPrompts' }],
  creator: 'TeamPrompts',
  publisher: 'TeamPrompts',
  metadataBase: new URL('https://teamprompts.io'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://teamprompts.io',
    title: 'TeamPrompts - Team Prompt Library for AI Workflows',
    description: 'Stop losing your team\'s best AI prompts. Build a searchable, shareable library.',
    siteName: 'TeamPrompts',
    images: [
      {
        url: 'https://teamprompts.io/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TeamPrompts - Team Prompt Library'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeamPrompts - Team Prompt Library for AI Workflows',
    description: 'Stop losing your team\'s best AI prompts. Build a searchable, shareable library.',
    creator: '@teamprompts',
    images: ['https://teamprompts.io/twitter-image.png']
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
