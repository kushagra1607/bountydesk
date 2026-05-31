"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import posthog from "posthog-js";

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "signup") {
      // Create a pre-confirmed user via the edge function (sends no email),
      // then sign in below to establish the session.
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/signup`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            },
            body: JSON.stringify({ email, password }),
          },
        );
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          setLoading(false);
          setError(body.error || "Sign up failed. Please try again.");
          return;
        }
        // Track signup event
        posthog.capture("user_signed_up", { email });
      } catch {
        setLoading(false);
        setError("Could not reach the server. Please try again.");
        return;
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Identify user in PostHog
    posthog.identify(email, { email });
    if (mode === "login") posthog.capture("user_logged_in", { email });

    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link
        href="/"
        className="mb-8 text-center font-mono text-lg font-bold"
      >
        <span className="text-accent">~/</span>bountydesk
      </Link>

      <div className="card p-7">
        <h1 className="text-xl font-bold">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {mode === "signup"
            ? "Start tracking your bounties — free, no card."
            : "Log in to your BountyDesk."}
        </p>

        {!configured && (
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
            Supabase isn&apos;t configured yet. Add your keys to{" "}
            <code>.env.local</code> and restart — see <code>SETUP.md</code>.
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-muted">Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !configured}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading
              ? "Please wait…"
              : mode === "signup"
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-accent">
                Log in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link href="/signup" className="text-accent">
                Create an account
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
