import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Terms of Service — BountyDesk",
  description: "The terms that govern your use of BountyDesk.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="May 30, 2026">
      <p>
        These Terms of Service (the &ldquo;Terms&rdquo;) govern your access to
        and use of BountyDesk (the &ldquo;Service&rdquo;), a web application
        available at https://bountydesk.vercel.app. The Service is operated by
        Kushagra Kartikey, a sole proprietor based in Bihar, India (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By creating an account or using
        the Service, you agree to these Terms. If you do not agree, do not use
        the Service.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">1. The Service</h2>
      <p>
        BountyDesk is a productivity tool for security researchers. It lets you
        track vulnerability submissions across bug bounty programs, monitor their
        status and payouts, view earnings analytics, and generate formatted
        vulnerability reports. The Service is provided on a subscription basis
        with a free tier and a paid Pro tier.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">2. Accounts</h2>
      <p>
        You must provide accurate information when registering and keep your
        login credentials secure. You are responsible for all activity that
        occurs under your account. You must be at least 18 years old, or the age
        of majority in your jurisdiction, to use the Service.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        3. Acceptable use
      </h2>
      <p>
        You agree to use the Service only for lawful purposes. You may not use
        the Service to store or transmit unlawful content, attempt to gain
        unauthorized access to the Service or its infrastructure, interfere with
        its normal operation, or resell access without our permission. You are
        solely responsible for ensuring that any security testing you record in
        the Service was conducted lawfully and with proper authorization.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        4. Subscriptions and billing
      </h2>
      <p>
        Paid plans are billed in advance on a recurring monthly basis. Payments
        are processed by Paddle.com Market Limited (&ldquo;Paddle&rdquo;), our
        authorized reseller and Merchant of Record. Paddle handles the
        transaction, issues your receipt, and manages applicable taxes. By
        purchasing a paid plan you also agree to Paddle&rsquo;s buyer terms.
        Subscriptions renew automatically until cancelled. You can cancel at any
        time, and your paid features remain active until the end of the current
        billing period.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        5. Refunds
      </h2>
      <p>
        Refunds are handled in accordance with our{" "}
        <a href="/refund" className="text-emerald-400 hover:underline">
          Refund Policy
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        6. Your content
      </h2>
      <p>
        You retain ownership of the data you enter into the Service, such as
        program details, submissions, and notes. You grant us a limited license
        to store and process that data solely to operate and provide the Service
        to you. We do not sell your data.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        7. Intellectual property
      </h2>
      <p>
        The Service, including its software, design, and branding, is owned by us
        and protected by applicable law. These Terms do not grant you any right
        to our trademarks or to copy or redistribute the Service.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        8. Disclaimers
      </h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; without warranties of any kind, whether express or
        implied. We do not warrant that the Service will be uninterrupted,
        error-free, or that it will meet your specific requirements.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        9. Limitation of liability
      </h2>
      <p>
        To the maximum extent permitted by law, we will not be liable for any
        indirect, incidental, or consequential damages, or for any loss of data
        or profits, arising from your use of the Service. Our total liability for
        any claim relating to the Service will not exceed the amount you paid us
        in the twelve months before the claim.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        10. Termination
      </h2>
      <p>
        You may stop using the Service and delete your account at any time. We
        may suspend or terminate your access if you breach these Terms or use the
        Service in a way that could cause harm to us or other users.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        11. Changes to these Terms
      </h2>
      <p>
        We may update these Terms from time to time. If we make material changes,
        we will update the &ldquo;Last updated&rdquo; date above and, where
        appropriate, notify you. Continued use of the Service after changes take
        effect constitutes acceptance of the revised Terms.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">
        12. Governing law
      </h2>
      <p>
        These Terms are governed by the laws of India, without regard to conflict
        of law principles.
      </p>

      <h2 className="text-xl font-semibold text-neutral-100">13. Contact</h2>
      <p>
        Questions about these Terms can be sent to{" "}
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
