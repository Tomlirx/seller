"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Account created, but login failed. Try logging in.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm w-full px-4 py-16">
      <h1 className="font-serif text-2xl text-ink mb-6">注册 · Sign up</h1>
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
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="border border-line bg-ivory-light rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-gold text-ivory-light rounded px-3 py-2 tracking-wide hover:bg-gold-soft transition-colors disabled:opacity-50"
        >
          {loading ? "创建账号中… Creating account…" : "注册 Sign up"}
        </button>
      </form>
      <p className="text-sm mt-4 text-ink-soft">
        已有账号？ Already have an account? <a href="/login" className="text-gold underline">登录 Log in</a>
      </p>
    </div>
  );
}
