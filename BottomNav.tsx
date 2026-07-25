"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
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
    label: "Movimentos",
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
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-offwhite border-t border-line flex px-2 pt-2.5 pb-4">
      {items.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-1.5 ${
              active ? "text-terracota" : "text-ink-soft"
            }`}
          >
            <span className="w-[21px] h-[21px]">{item.icon}</span>
            <span className="text-[0.62rem] font-semibold font-body">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
