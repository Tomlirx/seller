"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";

export function Nav() {
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  return (
    <header className="bg-ivory border-b border-line">
      <nav className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-start leading-tight">
          <span className="font-serif text-xl tracking-wide text-ink">岚玉</span>
          <span className="text-[10px] tracking-[0.2em] text-gold">LAN YU</span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-ink">
          <Link href="/cart" className="hover:text-gold">
            购物车 Cart ({itemCount})
          </Link>
          {session?.user ? (
            <>
              <Link href="/orders" className="hover:text-gold">
                订单 Orders
              </Link>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="hover:text-gold">
                  Admin
                </Link>
              )}
              <button onClick={() => signOut()} className="text-gold underline">
                登出 Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gold">
                登录 Log in
              </Link>
              <Link href="/signup" className="text-gold underline">
                注册 Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
