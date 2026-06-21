"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm w-full px-4 py-16">
      <h1 className="font-serif text-2xl text-ink mb-6">登录 · Log in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-line bg-ivory-light rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-line bg-ivory-light rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-gold text-ivory-light rounded px-3 py-2 tracking-wide hover:bg-gold-soft transition-colors disabled:opacity-50"
        >
          {loading ? "登录中… Logging in…" : "登录 Log in"}
        </button>
      </form>
      <p className="text-sm mt-4 text-ink-soft">
        没有账号？ No account? <a href="/signup" className="text-gold underline">注册 Sign up</a>
      </p>
    </div>
  );
}
