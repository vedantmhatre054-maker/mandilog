'use client';

import { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F7F8F2] dark:bg-[#131D16]">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[80] md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-y-0 left-0 max-h-screen overflow-y-auto shadow-2xl">
            <div className="absolute right-2 top-2 z-10">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Close navigation menu"
                className="rounded-xl bg-white p-2 text-[#26352B] shadow-sm dark:bg-[#1b2920] dark:text-[#e6ece8]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-[#F7F8F2] dark:bg-[#131D16]">
        <div className="flex items-center gap-2 border-b border-[#DFE5DA] bg-white px-4 py-2 dark:border-[#2A3F32] dark:bg-[#17231B] md:hidden">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#246B45] hover:bg-[#E8EFE4] dark:text-[#76A94C] dark:hover:bg-[#213327]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-serif font-semibold text-[#26352B] dark:text-[#e6ece8]">
            Navigation
          </span>
        </div>
        <Navbar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
