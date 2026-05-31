import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Security — BountyDesk",
  description:
    "Responsible disclosure program for BountyDesk. Found a bug? Report it and get credit + free Pro for life.",
};

export default function SecurityPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">Security & Responsible Disclosure</h1>
        <p className="mt-4 text-muted">
          BountyDesk is built for bug bounty hunters. So obviously, our own
          security has to be solid. If you find a vulnerability, we want to
          hear from you.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">What we offer</h2>
          <p className="text-sm text-muted">
            I&apos;m a solo developer bootstrapping this. I can&apos;t pay
            cash bounties yet, but for every valid security report you&apos;ll
            get:
          </p>
          <ul className="ml-5 list-disc space-y-1 text-sm">
            <li>Public credit in the Hall of Fame below</li>
            <li>Free BountyDesk Pro for life</li>
            <li>A genuine thank-you note from the founder</li>
            <li>
              An X / LinkedIn shoutout (with your permission)
            </li>
            <li>
              <strong>Backpay promise:</strong> when BountyDesk becomes
              profitable, verified reports from this period will be retro-paid.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">How to report</h2>
          <p className="text-sm">
            Email{" "}
            <a
              href="mailto:kartikeykushagra8@gmail.com?subject=%5BSECURITY%5D%20"
              className="text-accent underline"
            >
              kartikeykushagra8@gmail.com
            </a>{" "}
            with the subject line starting{" "}
            <code className="rounded bg-surface-2 px-1">[SECURITY]</code>.
          </p>
          <p className="text-sm text-muted">
            Please include: a clear description, reproduction steps, impact,
            and (if possible) a suggested fix.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">In scope</h2>
          <ul className="ml-5 list-disc space-y-1 text-sm">
            <li>
              <code>bountydesk.vercel.app</code> and any future custom domain
            </li>
            <li>Authentication, authorization, IDOR, privilege escalation</li>
            <li>Payment / billing manipulation (Paddle webhook, plan changes)</li>
            <li>Data leakage between users (RLS bypass)</li>
            <li>XSS, CSRF, SSRF, injection attacks</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Out of scope</h2>
          <ul className="ml-5 list-disc space-y-1 text-sm">
            <li>Denial of Service (DoS / DDoS)</li>
            <li>Brute-force or rate-limit testing</li>
            <li>Social engineering</li>
            <li>Spam / mass account creation</li>
            <li>Bugs in third-party services (Vercel, Supabase, Paddle)</li>
            <li>
              Missing security headers without demonstrated exploitability
            </li>
            <li>Self-XSS or issues requiring physical access</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Ground rules</h2>
          <ul className="ml-5 list-disc space-y-1 text-sm">
            <li>Don&apos;t access, modify, or delete other users&apos; data</li>
            <li>Don&apos;t publicly disclose before we&apos;ve had a chance to fix</li>
            <li>
              Use test accounts you create yourself (signup is free)
            </li>
            <li>
              We aim to respond within 48 hours and resolve high-severity
              issues within 7 days
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Hall of Fame</h2>
          <p className="text-sm text-muted">
            Researchers who helped make BountyDesk safer:
          </p>
          <p className="text-sm italic text-muted">
            Be the first — find a bug, get listed here.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
