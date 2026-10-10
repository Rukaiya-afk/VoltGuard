import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VoltGuard | AI Residential Circuit Anomaly & Fire Mitigation Platform',
  description: 'Sub-20ms circuit breaker trip simulation, telemetry streaming, Isolation Forest anomaly detection, and NIL-disaggregated utility billing census.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${sansFont.variable} ${monoFont.variable}`}>
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen font-sans tracking-normal leading-relaxed selection:bg-teal-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
