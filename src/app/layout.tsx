import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MandiLog | Farmer First Agricultural Platform',
  description:
    'AI-powered agricultural platform for farmers, featuring APMC mandi market intelligence, net profit comparison, online bidding, and delivery coordination.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f4f0ea] text-black min-h-screen antialiased selection:bg-[#fef08a] selection:text-black">
        {children}
      </body>
    </html>
  );
}

