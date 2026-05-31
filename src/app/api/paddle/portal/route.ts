import { NextResponse } from "next/server";
import { getAccount } from "@/lib/account";
import { getPaddle, isPaddleConfigured } from "@/lib/paddle";

function siteUrl(req: Request) {
  return (process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin).replace(
    /\/$/,
    "",
  );
}

export async function POST(request: Request) {
  const base = siteUrl(request);

  if (!isPaddleConfigured()) {
    return NextResponse.redirect(
      `${base}/dashboard/billing?status=paddle_off`,
      { status: 303 },
    );
  }

  const { profile } = await getAccount();
  const customerId = profile.paddle_customer_id;
  if (!customerId) {
    return NextResponse.redirect(`${base}/dashboard/billing?status=error`, {
      status: 303,
    });
  }

  const subIds = profile.paddle_subscription_id
    ? [profile.paddle_subscription_id]
    : [];

  const session = (await getPaddle().customerPortalSessions.create(
    customerId,
    subIds,
  )) as { urls?: { general?: { overview?: string } } };
  const url = session.urls?.general?.overview;
  if (!url) {
    return NextResponse.redirect(`${base}/dashboard/billing?status=error`, {
      status: 303,
    });
  }
  return NextResponse.redirect(url, { status: 303 });
}
