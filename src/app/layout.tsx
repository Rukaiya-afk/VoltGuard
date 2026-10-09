import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VoltGuard | AI Residential Circuit Anomaly & Fire Mitigation Platform',
  description: 'Sub-20ms circuit breaker trip simulation, Kaggle/UCI telemetry streaming, Isolation Forest anomaly detection, and NIL-disaggregated utility billing census.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
