"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Divider } from "@/components/divider";

const inputClass =
  "h-[52px] w-full bg-surface border border-line px-4 text-ink placeholder:text-text-faint focus:outline-none focus:border-gold focus:shadow-[inset_0_0_0_1px_var(--gold)]";

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
    <div className="mx-auto max-w-md w-full px-6 py-24">
      <p className="text-xs tracking-[0.3em] text-gold mb-3">ACCOUNT</p>
      <h1 className="font-serif text-3xl text-ink mb-4">登录 · Log in</h1>
      <Divider className="mb-8" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.15em] text-text-faint">邮箱 Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.15em] text-text-faint">密码 Password</span>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </label>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="h-[52px] bg-gold text-canvas uppercase tracking-[0.12em] text-sm hover:bg-gold-deep transition-colors disabled:opacity-50"
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
