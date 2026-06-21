"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";

export function Nav() {
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  return (
    <header className="border-b">
      <nav className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          Seller
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/cart">Cart ({itemCount})</Link>
          {session?.user ? (
            <>
              <Link href="/orders">Orders</Link>
              {session.user.role === "ADMIN" && <Link href="/admin">Admin</Link>}
              <button onClick={() => signOut()} className="underline">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href="/signup">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
