"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        if (res.status === 429) {
          setError(
            "Too many attempts. Wait about 15 minutes and try again.",
          );
        } else {
          setError(data.error || "Incorrect password.");
        }
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="admin-card w-full max-w-md">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--oak)]">
          Owner access
        </p>
        <h1 className="font-display mt-2 text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-white/55">
          Upload projects, manage testimonials, and build proposals.
        </p>
        <label className="mt-8 block text-sm">
          <span className="mb-2 block text-white/60">Password</span>
          <input
            type="password"
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </label>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Enter dashboard"}
        </button>
      </form>
    </div>
  );
}
