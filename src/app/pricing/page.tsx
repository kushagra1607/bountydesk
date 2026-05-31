import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PRO_PRICE_USD } from "@/lib/constants";

export const metadata = {
  title: "Pricing — BountyDesk",
  description:
    "Simple pricing for BountyDesk: a free plan plus Pro at $7/month. Cancel anytime.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-center text-3xl font-bold">Simple, honest pricing</h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Start free. Upgrade to Pro when you outgrow it. Cancel anytime — no
          contracts, no surprises.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="card p-7">
            <h2 className="text-lg font-semibold">Free</h2>
            <p className="mt-1 text-3xl font-bold">
              $0<span className="text-base font-normal text-muted">/mo</span>
            </p>
            <p className="mt-1 text-sm text-muted">For getting started.</p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              <li>✓ Up to 15 submissions</li>
              <li>✓ Up to 5 programs</li>
              <li>✓ Earnings dashboard</li>
              <li>✓ Report builder (copy to clipboard)</li>
            </ul>
            <Link href="/signup" className="btn-ghost mt-6 block text-center">
              Start free
            </Link>
          </div>

          <div className="card border-accent/40 p-7">
            <h2 className="text-lg font-semibold text-accent">Pro</h2>
            <p className="mt-1 text-3xl font-bold">
              ${PRO_PRICE_USD}
              <span className="text-base font-normal text-muted">/mo</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              Billed monthly. Cancel anytime.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              <li>✓ Unlimited submissions &amp; programs</li>
              <li>✓ Markdown report export (.md)</li>
              <li>✓ Full analytics history</li>
              <li>✓ Priority on new features</li>
            </ul>
            <Link href="/signup" className="btn-primary mt-6 block text-center">
              Go Pro
            </Link>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted">
          Prices are in US dollars and billed monthly through Paddle, our
          Merchant of Record. Any applicable sales tax or VAT is shown at
          checkout. You can cancel future renewals at any time from your billing
          settings. See our{" "}
          <Link href="/refund" className="text-accent hover:underline">
            refund policy
          </Link>{" "}
          for details.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
