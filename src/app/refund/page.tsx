import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Refund Policy — BountyDesk",
  description: "How cancellations and refunds work for BountyDesk subscriptions.",
};

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" updated="May 30, 2026">
      <p>
        This Refund Policy applies to subscriptions to BountyDesk (the
        &ldquo;Service&rdquo;), operated by Kushagra Kartikey, a sole proprietor
        based in Bihar, India. Payments and refunds are handled by Paddle.com
        Market Limited (&ldquo;Paddle&rdquo;), our authorized reseller and
        Merchant of Record.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        1. Subscription billing
      </h2>
      <p>
        The BountyDesk Pro plan is billed in advance on a recurring monthly
        basis. There is also a free tier that does not require payment, so you
        can evaluate the Service before subscribing.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        2. Cancellation
      </h2>
      <p>
        You can cancel your subscription at any time from your account billing
        settings. When you cancel, you will not be charged again, and your Pro
        features will remain available until the end of the billing period you
        have already paid for. We do not provide prorated refunds for the unused
        portion of a billing period, except as described below.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        3. 14-day money-back guarantee
      </h2>
      <p>
        If you are not satisfied with BountyDesk Pro, you may request a full
        refund of your most recent payment within 14 days of that charge. Email
        us at{" "}
        <a
          href="mailto:kushagra832005@gmail.com"
          className="text-emerald-400 hover:underline"
        >
          kushagra832005@gmail.com
        </a>{" "}
        with the email address on your account, and we will arrange the refund
        through Paddle.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        4. How refunds are issued
      </h2>
      <p>
        Approved refunds are processed by Paddle to your original payment method.
        The time it takes for the refund to appear depends on your bank or card
        provider.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        5. Duplicate or accidental charges
      </h2>
      <p>
        If you believe you were charged in error or more than once, contact us
        and we will investigate and refund any incorrect charge.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">6. Contact</h2>
      <p>
        For any billing or refund question, reach us at{" "}
        <a
          href="mailto:kushagra832005@gmail.com"
          className="text-emerald-400 hover:underline"
        >
          kushagra832005@gmail.com
        </a>
        .
      </p>
    </LegalLayout>
  );
}
