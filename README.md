# BountyDesk

> The bug bounty tracker that takes 10 seconds to log a submission.

Built for hunters who are tired of juggling spreadsheets, Notion, and 5 hunting-platform dashboards.

🌐 **Live:** [bountydesk.vercel.app](https://bountydesk.vercel.app)
🛡️ **Security disclosure:** [bountydesk.vercel.app/security](https://bountydesk.vercel.app/security)
📜 **License:** AGPL-3.0 (see [LICENSE](./LICENSE))

---

## Why BountyDesk

Most bug bounty hunters track submissions in spreadsheets. That works at 5 reports — it breaks at 50.

BountyDesk gives you:

- 🎯 **One dashboard** for every submission across HackerOne, Bugcrowd, Intigriti, etc.
- 📝 **Markdown report builder** with battle-tested templates triagers actually accept
- 💰 **Payout tracking** per program — see which targets actually pay you
- 📊 **Status pipeline** — Draft → Submitted → Triaged → Resolved → Paid
- 📈 **Earnings dashboard** — totals, 6-month trend, hit-rate, top vuln classes

**Free tier:** 15 submissions / 5 programs.
**Pro ($7/mo):** Unlimited + Markdown export.

## Tech stack

- **Frontend:** Next.js 16 (App Router, Node.js runtime) + Tailwind v4 + TypeScript
- **Auth + DB:** Supabase (Postgres + Row Level Security + Auth)
- **Billing:** Paddle (Merchant of Record — handles tax/compliance globally)
- **Analytics:** PostHog (product analytics + session replay)
- **Hosting:** Vercel

## Security model

Every table has Postgres Row-Level Security so a user can only ever read or write their own rows — enforced at the database, not just the app. Plan limits are enforced server-side in Server Actions, not in the UI. The Paddle webhook is the only writer to `profiles.plan`, using HMAC-verified signatures.

Audit history + responsible disclosure policy: [/security](https://bountydesk.vercel.app/security)

## Self-hosting

Yes, you can host BountyDesk yourself — that's why the code is open. Most people will not bother (Paddle approval alone takes weeks for individuals), but the option is there.

Detailed setup: see [SETUP.md](./SETUP.md) and [DEPLOY.md](./DEPLOY.md).

Quick version:

```bash
git clone https://github.com/<your-fork>/bountydesk.git
cd bountydesk
npm install
cp .env.local.example .env.local   # fill in Supabase + Paddle keys
npm run dev                        # http://localhost:3100
```

Then deploy to Vercel: `npx vercel deploy --prod`.

## Security disclosure

Found a vulnerability? See [/security](https://bountydesk.vercel.app/security) and email me at **kartikeykushagra8@gmail.com** with subject `[SECURITY]`.

Valid reports get:
- ✅ Public credit in the Hall of Fame
- ✅ Free BountyDesk Pro for life
- ✅ Founder shoutout on X / LinkedIn
- ✅ Backpay promise when the product becomes profitable

## License (the short version)

**AGPL-3.0.** You can self-host, fork, learn from, and contribute to this code freely. But if you modify it and run it as a paid hosted service (i.e. compete with bountydesk.vercel.app), you must open-source your modifications under the same license.

This is the same license used by [PostHog](https://github.com/PostHog/posthog), [Plausible](https://github.com/plausible/analytics), and [Cal.com](https://github.com/calcom/cal.com).

## About the author

Built by [Kushagra Kartikey](https://x.com/bountydesk) — a 19-year-old solo founder learning bug bounty hunting and shipping tools for the community along the way.

Found a bug? Got a feature idea? Want to share what you'd build differently? **DM me on X** or open an issue. Real feedback shapes this product.

---

⭐ **Star this repo** if BountyDesk saves you time. It genuinely helps with discoverability.
