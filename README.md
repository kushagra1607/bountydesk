# BountyDesk

The workspace for bug bounty hunters. Track every submission, status, and
payout in one place — and generate clean Markdown reports that triagers
actually accept.

- **Submission pipeline** — Draft → Submitted → Triaged → Accepted/Dup → Paid
- **Earnings dashboard** — totals, 6-month trend, hit-rate, top vuln classes
- **Report builder** — battle-tested template → one-click clean Markdown
- **Free vs Pro** — Free: 15 submissions / 5 programs. Pro ($7/mo): unlimited + `.md` export

## Stack (100% free to run)

Next.js 16 (App Router) · Supabase (Postgres + Auth + RLS) · Tailwind CSS ·
deploys on Vercel.

## Get started

1. **[SETUP.md](SETUP.md)** — create a free Supabase project, load the schema,
   add keys, `npm run dev`. ~10 minutes.
2. **[DEPLOY.md](DEPLOY.md)** — ship free on Vercel, wire Paddle, and the
   step-by-step plan to get your first paying users.

## Security model

Every table has Postgres Row-Level Security so a user can only ever read or
write their own rows — enforced at the database, not just the app. Plan limits
are enforced server-side in Server Actions, not in the UI.
