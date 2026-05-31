# Deploy free + start earning

This is the part that turns BountyDesk from "a project" into "income". Follow
it in order.

---

## Part 1 — Ship it (free, ~15 min)

### 1. Push to GitHub

```bash
cd C:/Users/karti/bountydesk
git init
git add .
git commit -m "BountyDesk MVP"
# create an empty repo on github.com first, then:
git remote add origin https://github.com/<you>/bountydesk.git
git push -u origin main
```

`.env.local` is git-ignored — your keys never get committed. Good.

### 2. Deploy on Vercel (free Hobby plan)

1. Go to https://vercel.com → sign in with GitHub.
2. **Add New → Project** → import `bountydesk`.
3. Under **Environment Variables**, add the same 3 keys from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → set to your Vercel URL (e.g. `https://bountydesk.vercel.app`)
4. **Deploy**. Done — it's live and auto-deploys on every `git push`.

### 3. Point Supabase at the live URL

Supabase → **Authentication → URL Configuration** → set **Site URL** to your
Vercel URL and add it to **Redirect URLs**.

The free tier ceiling: Vercel Hobby + Supabase Free comfortably handles your
first few hundred users. You won't pay anything until you have real traction.

---

## Part 2 — Turn on real payments (Paddle)

We use **Paddle** instead of Stripe because Stripe is invite-only in India —
Paddle is a **Merchant of Record**, so it handles global cards, sales tax/VAT,
and pays out to an Indian bank. **The integration is already built** — overlay
checkout, customer portal, and webhook (`src/app/api/paddle/*`). Billing
auto-detects: no Paddle keys = the simulated "demo" upgrade so the app stays
usable; all keys present = real money. Steps (do it in **Sandbox** first):

1. Create a [Paddle](https://www.paddle.com) account. Use the **Sandbox**
   dashboard (sandbox-vendors.paddle.com) for testing while your live account
   is reviewed.
2. Grab three credentials from **Developer Tools → Authentication**:
   - **Client-side token** → `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` (`test_...`)
   - **API key** → `PADDLE_API_KEY` (server-only secret)
   - Set `NEXT_PUBLIC_PADDLE_ENV=sandbox` (flip to `production` when live).
   Also add `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Project Settings → API →
   `service_role`). **Server-only, never `NEXT_PUBLIC`** — the webhook uses it
   to flip plans with no user session (bypasses RLS).
3. Create the product + $7/mo price with one command (never charges anyone —
   just defines the catalog entry). Put `PADDLE_API_KEY` in `.env.local`, then:
   ```bash
   npm run setup:paddle
   ```
   Copy the printed `NEXT_PUBLIC_PADDLE_PRICE_ID` (`pri_...`) into `.env.local`.
   (Or create it by hand: **Catalog → Products → New**, add a recurring
   $7.00/month price, copy the price ID.)
4. Create the webhook: **Developer Tools → Notifications → New destination** →
   URL `https://YOUR-DOMAIN/api/paddle/webhook`, subscribe to the
   `subscription.*` events. Copy the destination's **secret key** →
   `PADDLE_WEBHOOK_SECRET`.
5. Approve your domain for checkout: **Checkout → Website approval** → add your
   Vercel domain (sandbox is lenient; production requires this).
6. Put all five vars in **Vercel** env too, then redeploy. `npm run verify`
   sanity-checks Supabase. "Upgrade to Pro" now opens real Paddle Checkout;
   Pro users get a "Manage / cancel subscription" button (Paddle portal).

Paddle takes ~5% + $0.50 and remits your taxes — a bit more than Stripe, but
it's the route that actually pays out to India without an invite.

---

## Part 3 — Get your first paying users (the actual hard part)

You already have the unfair advantage: **you're in the bug bounty community.**
Distribution, not code, is what makes this earn. Plan:

**Week 1 — validate**
- Use it yourself for your real hunting for a week. Fix what annoys you.
- Post a screenshot of your earnings dashboard on X/Twitter with
  `#bugbounty` + tag a few hunters: *"Got tired of my submissions spreadsheet,
  built this. Free to use: <link>"*. Show, don't pitch.

**Week 2 — distribute (all free channels)**
- r/bugbounty, r/netsec — a genuine "I built this, here's why" post.
- Bug bounty Discords (Nahamsec, InsiderPhD communities, platform Discords).
- A short demo video (Loom, free) — the report builder is the wow moment.
- DM 10 hunters you follow; ask for honest feedback, not a sale.

**Week 3 — convert**
- The free tier hooks them (15 submissions fills up fast for an active hunter).
- The $7 Pro upgrade prompt appears exactly when they hit the limit — that's
  your conversion moment. Keep the price low; volume + word of mouth wins here.

**Realistic math:** 1,000 free users at a 2–3% conversion = 20–30 paying users
= ~$150–210/mo recurring, on $0 infra. Then you raise price or add a
Teams tier. The lever to pull is always *more hunters reached*, not more features.

**Pricing rule:** don't discount below $7 to "get users" — free users are your
funnel; paid users should pay. Add value (CVSS calculator, recon notes,
program scope diffing, export to HackerOne format) before raising price.

---

## What's already done vs. your next moves

Done: full app, auth, tracker, dashboard, report builder, plan gating, **and
the complete Paddle billing system (checkout + customer portal + webhook)** —
builds clean on Next.js 16. Paddle just needs keys plugged in.

Your moves, in priority order:
1. Configure Supabase (`SETUP.md`) and use it for your own hunting this week.
2. Deploy to Vercel (Part 1).
3. Post the Twitter/Reddit launch (Part 3, Week 1–2) — do this *before*
   adding Paddle keys; validate demand first (demo mode works for this).
4. Plug in Paddle keys (Part 2) once people are asking how to pay — ~15 min,
   no coding.
