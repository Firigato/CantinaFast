import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fila Zero | Cantina da Escola',
  description: 'Peça seu lanche pelo celular e retire quando estiver pronto.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
