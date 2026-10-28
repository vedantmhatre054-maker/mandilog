import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/i18n';
import AIAssistantModal from '@/components/AIAssistantModal';
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
      <body className="min-h-screen bg-[#F7F8F2] text-[#26352B] antialiased selection:bg-[#E8EFE4]">
        <LanguageProvider>
          {children}
          <AIAssistantModal />
        </LanguageProvider>
      </body>
    </html>
  );
}
