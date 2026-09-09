import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import BannerSIH from '@/components/BannerSIH';
import { FontProvider } from '@/components/FontProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'MediT — AI-Based Medicine Delivery & Pharmacy Network',
  description:
    'On-demand AI-powered pharmaceutical delivery platform featuring Gemini Vision handwritten prescription OCR, real-time drug interaction checks, Jan Aushadhi generic alternative cost savings, and 24/7 AI Health Chatbot.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 flex flex-col">
        <FontProvider>
          <BannerSIH />
          {children}
        </FontProvider>
      </body>
    </html>
  );
}
