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
}) {
  const db = createServiceClient();
  const patch: Record<string, unknown> = { plan: opts.plan };
  if (opts.customerId) patch.paddle_customer_id = opts.customerId;
  if (opts.subscriptionId !== null) {
    patch.paddle_subscription_id = opts.subscriptionId;
  }

  if (opts.userId) {
    await db.from("profiles").update(patch).eq("id", opts.userId);
  } else if (opts.customerId) {
    await db
      .from("profiles")
      .update(patch)
      .eq("paddle_customer_id", opts.customerId);
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
        await setPlan({
          userId,
          customerId,
          subscriptionId: data.id ?? null,
          plan: active ? "pro" : "free",
        });
        break;
      }
      case EventName.SubscriptionCanceled: {
        await setPlan({ userId, customerId, subscriptionId: null, plan: "free" });
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
