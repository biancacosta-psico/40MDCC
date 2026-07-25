"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppShell({
  children,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  userName?: string | null;
  userEmail?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-offwhite">
      {/* top bar: fixed, always available, works on mobile/tablet/desktop */}
      <header className="fixed top-0 left-0 right-0 z-20 h-14 bg-offwhite/95 backdrop-blur border-b border-line flex items-center px-4 md:px-6">
        <button
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bege/60 -ml-1.5"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <span className="font-display text-sm font-semibold text-olive ml-2">
          Da Consciência ao Comportamento
        </span>
      </header>

      <Sidebar open={open} onClose={() => setOpen(false)} userName={userName} userEmail={userEmail} />

      <main className="pt-14 pb-24 md:pb-10">
        <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto">{children}</div>
      </main>

      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
