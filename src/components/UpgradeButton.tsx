"use client";

import { useState } from "react";
import { initializePaddle } from "@paddle/paddle-js";
import posthog from "posthog-js";

export default function UpgradeButton({
  priceId,
  clientToken,
  environment,
  email,
  userId,
  successUrl,
}: {
  priceId: string;
  clientToken: string;
  environment: "sandbox" | "production";
  email: string;
  userId: string;
  successUrl: string;
}) {
  const [loading, setLoading] = useState(false);

  async function upgrade() {
    setLoading(true);
    try {
      posthog.capture("upgrade_checkout_opened", { email, priceId });
      const paddle = await initializePaddle({ token: clientToken, environment });
      paddle?.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: email ? { email } : undefined,
        customData: { user_id: userId },
        settings: { displayMode: "overlay", theme: "dark", successUrl },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="btn-primary w-full" onClick={upgrade} disabled={loading}>
      {loading ? "Opening checkout…" : "Upgrade to Pro"}
    </button>
  );
}
