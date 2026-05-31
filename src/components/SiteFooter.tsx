import Link from "next/link";

// Shared footer. Links the legal/pricing pages Paddle requires the site to
// surface, and names Paddle as the Merchant of Record (required disclosure).
export default function SiteFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center text-sm text-muted">
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/pricing" className="hover:text-accent">
            Pricing
          </Link>
          <Link href="/terms" className="hover:text-accent">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-accent">
            Privacy Policy
          </Link>
          <Link href="/refund" className="hover:text-accent">
            Refund Policy
          </Link>
        </nav>
        <p>
          © {new Date().getFullYear()} BountyDesk — track more, write less, get
          paid faster.
        </p>
        <p className="text-xs">
          Payments are processed by Paddle.com Market Ltd, our authorized
          reseller and Merchant of Record.
        </p>
      </div>
    </footer>
  );
}
