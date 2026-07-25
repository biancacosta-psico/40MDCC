"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  {
    href: "/home",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11.5L12 4l9 7.5" />
        <path d="M5.5 10v9a1 1 0 0 0 1 1h4v-6h3v6h4a1 1 0 0 0 1-1v-9" />
      </svg>
    ),
  },
  {
    href: "/movimentos",
    label: "40 Movimentos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="6" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="18" r="2" />
        <path d="M6.6 7.4L10.4 10.6M13.6 13.4L17.4 16.6" strokeDasharray="2.2 2.2" />
      </svg>
    ),
  },
  {
    href: "/diario",
    label: "Diário",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5.5c2-1 5-1 8 .5V19c-3-1.5-6-1.5-8-.5V5.5z" />
        <path d="M20 5.5c-2-1-5-1-8 .5V19c3-1.5 6-1.5 8-.5V5.5z" />
      </svg>
    ),
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="12" width="4" height="8" rx="1" />
        <rect x="10" y="7" width="4" height="13" rx="1" />
        <rect x="16" y="3" width="4" height="17" rx="1" />
      </svg>
    ),
  },
  {
    href: "/manutencao",
    label: "Plano de manutenção",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4L12 3z" />
        <path d="M5 16l.9 2.1L8 19l-2.1.9L5 22l-.9-2.1L2 19l2.1-.9L5 16z" />
      </svg>
    ),
  },
];

export default function Sidebar({
  open,
  onClose,
  userName,
  userEmail,
}: {
  open: boolean;
  onClose: () => void;
  userName?: string | null;
  userEmail?: string | null;
}) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          aria-label="Fechar menu"
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-30 md:bg-black/20"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-olive text-offwhite flex flex-col transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-8">
            <span className="font-display text-base font-semibold">Bianca Costa</span>
            <button
              aria-label="Fechar menu"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="text-[0.65rem] font-mono tracking-wide uppercase text-[#c8cf9e] mb-2">
            Da Consciência ao Comportamento
          </div>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto">
          {links.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors ${
                  active ? "bg-offwhite text-olive font-semibold" : "text-[#e9e3d0] hover:bg-white/10"
                }`}
              >
                <span className="w-5 h-5 flex-shrink-0">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          {(userName || userEmail) && (
            <div className="px-3 mb-2">
              <div className="text-sm font-semibold truncate">{userName ?? userEmail}</div>
              {userName && userEmail && (
                <div className="text-xs text-[#c8cf9e] truncate">{userEmail}</div>
              )}
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-[#e9e3d0] hover:bg-white/10"
          >
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
