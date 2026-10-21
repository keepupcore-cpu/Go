import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GO — Terminal Steampunk (Caldeira Pesada)',
  description: 'Terminal industrial steampunk para caldeira pesada, controle de pressão, diretrizes e banco de cápsulas de dados.',
  openGraph: {
    title: 'GO — Terminal Steampunk (Caldeira Pesada)',
    description: 'Terminal industrial steampunk para caldeira pesada, controle de pressão, diretrizes e banco de cápsulas de dados.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GO — Terminal Steampunk (Caldeira Pesada)',
    description: 'Terminal industrial steampunk para caldeira pesada, controle de pressão, diretrizes e banco de cápsulas de dados.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0b0a09] text-[#e7e1df] antialiased min-h-screen selection:bg-[#ff8c00] selection:text-black" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
