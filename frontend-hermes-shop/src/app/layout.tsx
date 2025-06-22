import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import { AuthProvider } from '~/context/AuthProvider';
import './globals.css';

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hermes Shop',
  description:
    "Hermes: The world's most comfortable shoes, flats, and clothing made with natural materials like merino wool and eucalyptus.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body className={`${nunitoSans.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
