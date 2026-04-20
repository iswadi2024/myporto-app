import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'MyPorto - Platform Portofolio Digital Profesional',
  description:
    'Buat portofolio digital profesional dengan subdomain personal Anda. Tampilkan CV, pengalaman, dan keahlian Anda secara online.',
  keywords: ['portofolio', 'cv online', 'personal branding', 'myporto'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
