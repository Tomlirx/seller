"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";

const ICONS = {
  home: <path d="M4 11 L12 4 L20 11 V20 H14 V14 H10 V20 H4 Z" strokeLinejoin="round" />,
  collections: <path d="M4 6 H20 M4 12 H20 M4 18 H20" strokeLinecap="round" />,
  wishlist: (
    <path d="M12 20 C5 15 3 11 3 8 C3 5.5 5 4 7.5 4 C9.5 4 11 5 12 7 C13 5 14.5 4 16.5 4 C19 4 21 5.5 21 8 C21 11 19 15 12 20 Z" strokeLinejoin="round" />
  ),
  cart: (
    <path d="M3 4 H5 L7.5 16 H18 L20 7 H6.5 M9 21 a1 1 0 100-2 1 1 0 000 2 M17 21 a1 1 0 100-2 1 1 0 000 2" strokeLinejoin="round" />
  ),
  account: <path d="M12 12 a4 4 0 100-8 4 4 0 000 8 Z M4 20 c0-4 4-6 8-6 s8 2 8 6" strokeLinejoin="round" />,
} as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  if (pathname?.startsWith("/admin")) return null;

  const items: { key: keyof typeof ICONS; href: string; label: string; badge?: number; title?: string }[] = [
    { key: "home", href: "/", label: "首页" },
    { key: "collections", href: "/collections", label: "品类" },
    { key: "wishlist", href: "#", label: "收藏", title: "即将上线 Coming soon" },
    { key: "cart", href: "/cart", label: "购物袋", badge: itemCount },
    { key: "account", href: session?.user ? "/orders" : "/login", label: "我的" },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-ivory border-t border-line flex items-stretch">
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          title={item.title}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-ink-soft hover:text-gold transition-colors relative"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
            {ICONS[item.key]}
          </svg>
          <span className="text-[10px]">{item.label}</span>
          {!!item.badge && item.badge > 0 && (
            <span className="absolute top-1 right-1/4 bg-gold text-ivory-light text-[9px] rounded-full h-4 w-4 flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
