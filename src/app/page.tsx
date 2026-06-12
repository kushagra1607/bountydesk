import Link from "next/link";
import { PRO_PRICE_USD } from "@/lib/constants";
import SiteFooter from "@/components/SiteFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-mono text-lg font-bold">
            <span className="text-accent">~/</span>bountydesk
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <a
          href="https://www.producthunt.com/products/bountydesk"
          target="_blank"
          rel="noreferrer"
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition hover:bg-accent/15"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
          </span>
          Launching on Product Hunt — Vercel Day, June 16
        </a>
        <p className="mb-4 inline-block rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          Built by hunters, for hunters
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          Stop tracking bounties in a{" "}
          <span className="text-accent">messy spreadsheet</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
          BountyDesk is the workspace for bug bounty hunters: track every
          submission, status, and payout — and generate clean reports that
          triagers actually accept.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/signup" className="btn-primary px-6 py-3 text-base">
            Start free — no card
          </Link>
          <Link href="/login" className="btn-ghost px-6 py-3 text-base">
            I have an account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-20 sm:grid-cols-3">
        {[
          {
            t: "Submission pipeline",
            d: "Every report from Draft → Submitted → Triaged → Paid. Never lose track of a dupe or a follow-up again.",
          },
          {
            t: "Earnings dashboard",
            d: "Total payouts, monthly trend, hit-rate, top programs and your most profitable vuln classes — at a glance.",
          },
          {
            t: "Report builder",
            d: "A battle-tested template (summary, repro, impact, PoC, fix) → one-click clean Markdown ready to paste.",
          },
        ].map((f) => (
          <div key={f.t} className="card p-6">
            <h3 className="font-semibold text-accent">{f.t}</h3>
            <p className="mt-2 text-sm text-muted">{f.d}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-4xl px-6 pb-24">
        <h2 className="mb-8 text-center text-2xl font-bold">Simple pricing</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card p-7">
            <h3 className="text-lg font-semibold">Free</h3>
            <p className="mt-1 text-3xl font-bold">
              $0<span className="text-base font-normal text-muted">/mo</span>
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              <li>✓ Up to 15 submissions</li>
              <li>✓ Up to 5 programs</li>
              <li>✓ Earnings dashboard</li>
              <li>✓ Report builder (copy)</li>
            </ul>
            <Link href="/signup" className="btn-ghost mt-6 block text-center">
              Start free
            </Link>
          </div>
          <div className="card border-accent/40 p-7">
            <h3 className="text-lg font-semibold text-accent">Pro</h3>
            <p className="mt-1 text-3xl font-bold">
              ${PRO_PRICE_USD}
              <span className="text-base font-normal text-muted">/mo</span>
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              <li>✓ Unlimited submissions & programs</li>
              <li>✓ Markdown report export (.md)</li>
              <li>✓ Full analytics history</li>
              <li>✓ Priority on new features</li>
            </ul>
            <Link href="/signup" className="btn-primary mt-6 block text-center">
              Go Pro
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
