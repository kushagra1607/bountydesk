import { NextResponse } from "next/server";
import { EventName } from "@paddle/paddle-node-sdk";
import { getPaddle } from "@/lib/paddle";
import { createServiceClient } from "@/lib/supabase/admin";

type SubData = {
  id?: string;
  customerId?: string;
  status?: string;
  customData?: Record<string, unknown> | null;
};

async function setPlan(opts: {
  userId: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  plan: "free" | "pro";
}): Promise<{ email: string | null }> {
  const db = createServiceClient();
  const patch: Record<string, unknown> = { plan: opts.plan };
  if (opts.customerId) patch.paddle_customer_id = opts.customerId;
  if (opts.subscriptionId !== null) {
    patch.paddle_subscription_id = opts.subscriptionId;
  }

  let email: string | null = null;
  if (opts.userId) {
    const { data } = await db
      .from("profiles")
      .update(patch)
      .eq("id", opts.userId)
      .select("email")
      .single();
    email = (data?.email as string | undefined) ?? null;
  } else if (opts.customerId) {
    const { data } = await db
      .from("profiles")
      .update(patch)
      .eq("paddle_customer_id", opts.customerId)
      .select("email")
      .single();
    email = (data?.email as string | undefined) ?? null;
  }
  return { email };
}

// Fire a PostHog event server-side so the existing PostHog->Slack pipeline
// can ping #all-bountydesk when payment completes. Best-effort: failures here
// never break the webhook response back to Paddle.
async function capturePostHogEvent(
  event: string,
  distinctId: string,
  properties: Record<string, unknown>,
) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
  try {
    await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        event,
        distinct_id: distinctId,
        properties,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // swallow — alerting failure must not block billing
  }
}

export async function POST(request: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 400 },
    );
  }

  // Paddle signs the raw, unparsed body — read it as text before any parsing.
  const signature = request.headers.get("paddle-signature") ?? "";
  const body = await request.text();

  let eventType = "";
  let data: SubData = {};
  try {
    const event = await getPaddle().webhooks.unmarshal(body, secret, signature);
    eventType = event?.eventType ?? "";
    data = (event?.data ?? {}) as unknown as SubData;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "bad signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    const userId = (data.customData?.user_id as string | undefined) ?? null;
    const customerId = data.customerId ?? null;

    switch (eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionUpdated: {
        const active = data.status === "active" || data.status === "trialing";
        const { email } = await setPlan({
          userId,
          customerId,
          subscriptionId: data.id ?? null,
          plan: active ? "pro" : "free",
        });
        // Fire a server-side PostHog event the moment a paid sub goes active.
        // The PostHog -> Slack CDP function "subscription_activated" picks this
        // up and pings #all-bountydesk in real time.
        if (active) {
          await capturePostHogEvent(
            "subscription_activated",
            email || userId || customerId || "unknown",
            {
              email,
              user_id: userId,
              customer_id: customerId,
              subscription_id: data.id,
              event_type: eventType,
            },
          );
        }
        break;
      }
      case EventName.SubscriptionCanceled: {
        const { email } = await setPlan({
          userId,
          customerId,
          subscriptionId: null,
          plan: "free",
        });
        await capturePostHogEvent(
          "subscription_canceled",
          email || userId || customerId || "unknown",
          {
            email,
            user_id: userId,
            customer_id: customerId,
            subscription_id: data.id,
          },
        );
        break;
      }
      default:
        break;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "handler error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
