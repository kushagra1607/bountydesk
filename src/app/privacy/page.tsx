import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Privacy Policy — BountyDesk",
  description: "How BountyDesk collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="May 30, 2026">
      <p>
        This Privacy Policy explains how BountyDesk (the &ldquo;Service&rdquo;),
        operated by Kushagra Kartikey, a sole proprietor based in Bihar, India
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), collects,
        uses, and protects your information when you use
        https://bountydesk.vercel.app.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        1. Information we collect
      </h2>
      <p>We collect the following categories of information:</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>
          <strong>Account information:</strong> your email address and
          authentication details, which you provide when you sign up.
        </li>
        <li>
          <strong>Content you create:</strong> the data you enter into the
          Service, such as bug bounty programs, submissions, statuses, payout
          amounts, and report drafts.
        </li>
        <li>
          <strong>Technical information:</strong> basic usage and device data,
          such as log information needed to operate and secure the Service.
        </li>
        <li>
          <strong>Payment information:</strong> when you subscribe to a paid
          plan, payment details are collected and processed directly by Paddle,
          our Merchant of Record. We do not receive or store your full card
          details.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-neutral-100">
        2. How we use your information
      </h2>
      <p>
        We use your information to provide and maintain the Service, authenticate
        your account, process subscriptions, respond to support requests, and
        improve and secure the Service. We do not sell your personal
        information.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        3. Service providers
      </h2>
      <p>
        We rely on a small number of trusted providers to operate the Service:
      </p>
      <ul className="list-disc space-y-1 pl-6">
        <li>
          <strong>Supabase</strong> — database, authentication, and hosting of
          your account and content data.
        </li>
        <li>
          <strong>Vercel</strong> — application hosting and delivery.
        </li>
        <li>
          <strong>Paddle</strong> — payment processing and billing as Merchant
          of Record.
        </li>
      </ul>
      <p>
        These providers process data on our behalf and are bound by their own
        privacy and security obligations.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">4. Cookies</h2>
      <p>
        We use strictly necessary cookies to keep you signed in and to operate
        the Service. We do not use advertising cookies.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        5. Data retention
      </h2>
      <p>
        We retain your information for as long as your account is active. If you
        delete your account, we will delete or anonymize your personal data
        within a reasonable period, except where we are required to retain it to
        comply with legal obligations.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">6. Security</h2>
      <p>
        We take reasonable technical and organizational measures to protect your
        information. However, no method of transmission or storage is completely
        secure, and we cannot guarantee absolute security.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">7. Your rights</h2>
      <p>
        Depending on your location, you may have the right to access, correct, or
        delete your personal data, or to object to or restrict certain
        processing. To exercise these rights, contact us using the details
        below.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        8. International transfers
      </h2>
      <p>
        Your information may be processed and stored in countries other than your
        own. Where this happens, we take steps to ensure your data continues to
        receive appropriate protection.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">9. Children</h2>
      <p>
        The Service is not directed at children and is intended for users who are
        at least 18 years old. We do not knowingly collect personal data from
        children.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        10. Changes to this policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. We will update the
        &ldquo;Last updated&rdquo; date above when we do.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">11. Contact</h2>
      <p>
        For privacy questions or requests, contact us at{" "}
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
