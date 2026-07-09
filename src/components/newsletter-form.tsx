"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setStatus("error");
      return;
    }

    setStatus("done");
    setEmail("");
  }

  if (status === "done") {
    return <p className="text-sm text-jade-deep">感谢订阅 · Thank you for subscribing.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="您的邮箱 Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-text-faint focus:outline-none focus:border-gold focus:shadow-[inset_0_0_0_1px_var(--gold)]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="border border-gold/40 text-gold px-4 py-2 text-sm uppercase tracking-[0.12em] hover:bg-gold hover:text-canvas hover:border-gold transition-colors disabled:opacity-50"
        >
          订阅 Subscribe
        </button>
      </div>
      {error && <p className="text-danger text-xs">{error}</p>}
    </form>
  );
}
