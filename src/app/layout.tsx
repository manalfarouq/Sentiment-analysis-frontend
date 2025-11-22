import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sentiment Analysis',
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
        {children}
      </body>
    </html>
  );
}