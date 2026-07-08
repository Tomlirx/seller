"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";

export function Nav() {
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-canvas/92 backdrop-blur-md border-b transition-all duration-300 ${
          scrolled ? "h-[72px] border-line-strong" : "h-[86px] border-line"
        }`}
      >
        <nav className="mx-auto max-w-[1600px] px-6 sm:px-20 h-full grid grid-cols-3 items-center">
          <Link href="/" className="flex flex-col items-start leading-tight">
            <span className="font-serif text-xl tracking-wide text-ink">岚玉</span>
            <span className="text-[10px] tracking-[0.2em] text-ink-soft">LAN YU</span>
          </Link>

          <div className="hidden sm:flex justify-center">
            <Link
              href="/collections"
              className="text-sm tracking-wide text-ink hover:text-gold transition-colors"
            >
              品类 Collections
            </Link>
          </div>

          <div className="flex items-center justify-end gap-4 text-ink">
            <span title="搜索 Search (coming soon)" className="cursor-default hidden sm:inline-flex">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20 L16.5 16.5" strokeLinecap="round" />
              </svg>
            </span>
            <span title="收藏 Wishlist (coming soon)" className="cursor-default hidden sm:inline-flex">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                <path d="M12 20 C5 15 3 11 3 8 C3 5.5 5 4 7.5 4 C9.5 4 11 5 12 7 C13 5 14.5 4 16.5 4 C19 4 21 5.5 21 8 C21 11 19 15 12 20 Z" strokeLinejoin="round" />
              </svg>
            </span>
            <Link href="/cart" className="relative hover:text-gold transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                <path d="M3 4 H5 L7.5 16 H18 L20 7 H6.5 M9 21 a1 1 0 100-2 1 1 0 000 2 M17 21 a1 1 0 100-2 1 1 0 000 2" strokeLinejoin="round" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-canvas text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="hover:text-gold transition-colors"
                aria-label="Account"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20 c0-4 4-6 8-6 s8 2 8 6" />
                </svg>
              </button>
              {accountOpen && (
                <div
                  className="absolute right-0 top-8 bg-surface border border-line py-2 w-44 text-sm text-ink flex flex-col"
                  onMouseLeave={() => setAccountOpen(false)}
                >
                  {session?.user ? (
                    <>
                      <Link href="/orders" className="px-4 py-2 hover:text-gold" onClick={() => setAccountOpen(false)}>
                        订单 Orders
                      </Link>
                      {session.user.role === "ADMIN" && (
                        <Link href="/admin" className="px-4 py-2 hover:text-gold" onClick={() => setAccountOpen(false)}>
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="px-4 py-2 text-left text-gold"
                      >
                        登出 Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="px-4 py-2 hover:text-gold" onClick={() => setAccountOpen(false)}>
                        登录 Log in
                      </Link>
                      <Link href="/signup" className="px-4 py-2 text-gold" onClick={() => setAccountOpen(false)}>
                        注册 Sign up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      <div className="h-[86px]" />
    </>
  );
}
