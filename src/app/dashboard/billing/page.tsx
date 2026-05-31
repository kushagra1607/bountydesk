import { getAccount } from "@/lib/account";
import { PRO_PRICE_USD } from "@/lib/constants";
import { isPaddleConfigured, paddleClientEnv } from "@/lib/paddle";
import UpgradeButton from "@/components/UpgradeButton";

const BANNERS: Record<string, { cls: string; msg: string }> = {
  success: {
    cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    msg: "Payment received — welcome to Pro! It may take a few seconds to reflect.",
  },
  cancelled: {
    cls: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    msg: "Checkout cancelled. No charge was made.",
  },
  error: {
    cls: "border-red-500/30 bg-red-500/10 text-red-300",
    msg: "Something went wrong starting that session. Please try again.",
  },
  paddle_off: {
    cls: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    msg: "Payments aren't configured on this deployment yet.",
  },
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { user, plan } = await getAccount();
  const isPro = plan === "pro";
  const paddleOn = isPaddleConfigured();
  const { status } = await searchParams;
  const banner = status ? BANNERS[status] : undefined;

  const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const successUrl = `${base}/dashboard/billing?status=success`;

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold">Billing</h1>
      <p className="mt-1 text-sm text-muted">
        You are on the{" "}
        <span className={isPro ? "text-accent" : ""}>
          {isPro ? "Pro" : "Free"}
        </span>{" "}
        plan.
      </p>

      {banner && (
        <div className={`mt-4 rounded-lg border p-3 text-sm ${banner.cls}`}>
          {banner.msg}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-semibold">Free</h2>
          <p className="mt-1 text-2xl font-bold">
            $0<span className="text-sm font-normal text-muted">/mo</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>✓ 15 submissions</li>
            <li>✓ 5 programs</li>
            <li>✓ Dashboard & report builder</li>
            <li>✗ Markdown export</li>
          </ul>
          {isPro && paddleOn && (
            <form action="/api/paddle/portal" method="post" className="mt-6">
              <button className="btn-ghost w-full">
                Manage / cancel subscription
              </button>
            </form>
          )}
        </div>

        <div className="card border-accent/40 p-6">
          <h2 className="font-semibold text-accent">Pro</h2>
          <p className="mt-1 text-2xl font-bold">
            ${PRO_PRICE_USD}
            <span className="text-sm font-normal text-muted">/mo</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>✓ Unlimited submissions & programs</li>
            <li>✓ Markdown report export (.md)</li>
            <li>✓ Full analytics history</li>
            <li>✓ Priority on new features</li>
          </ul>

          {isPro ? (
            <p className="mt-6 text-center text-sm text-accent">
              ✓ Your current plan
            </p>
          ) : paddleOn ? (
            <div className="mt-6">
              <UpgradeButton
                priceId={process.env.NEXT_PUBLIC_PADDLE_PRICE_ID!}
                clientToken={process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!}
                environment={paddleClientEnv()}
                email={user.email ?? ""}
                userId={user.id}
                successUrl={successUrl}
              />
            </div>
          ) : (
            <p className="mt-6 text-center text-sm text-muted">
              Payments are temporarily unavailable. Please check back soon.
            </p>
          )}
        </div>
      </div>

      {paddleOn ? (
        <p className="mt-6 text-xs text-muted">
          Secure payments by Paddle, our Merchant of Record — taxes and global
          cards handled. Manage or cancel anytime from the customer portal.
        </p>
      ) : (
        <p className="mt-6 text-xs text-muted">
          Demo mode: the upgrade is simulated instantly so the product is fully
          testable. Add Paddle keys (see <code className="mx-1">DEPLOY.md</code>)
          to take real payments — checkout, customer portal, and webhook are
          already built.
        </p>
      )}
    </div>
  );
}
