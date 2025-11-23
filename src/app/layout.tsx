import type { Metadata } from 'next';
import './globals.css';
import TypewriterBanner from '@/components/TypewriterBanner';

export const metadata: Metadata = {
  title: 'TasentimentXP',
  description: 'Analysez vos commentaires avec l\'IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <TypewriterBanner />
        {children}
      </body>
    </html>
  );
}
