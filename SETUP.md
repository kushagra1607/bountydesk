# BountyDesk — Setup (10 minutes, all free)

BountyDesk is a submission tracker + report builder for bug bounty hunters.
Stack: Next.js 16 + Supabase (free) + Vercel (free).

## 1. Create a free Supabase project

1. Go to https://supabase.com → sign up (free, no card).
2. **New project** → pick a name + a strong DB password → region close to you.
3. Wait ~2 min for it to provision.

## 2. Load the database schema

1. In Supabase, open **SQL Editor → New query**.
2. Copy the entire contents of [`supabase/schema.sql`](supabase/schema.sql), paste it, click **Run**.
3. You should see "Success. No rows returned".

## 3. Turn off email confirmation (so signup is instant for the MVP)

1. Supabase → **Authentication → Sign In / Providers → Email**.
2. Toggle **Confirm email** to **OFF**, save.
   (You can re-enable this later once you wire a real email domain.)

## 4. Get your API keys

1. Supabase → **Project Settings → API**.
2. Copy the **Project URL**, the **anon / public** key, and the
   **service_role** key.
3. Open `.env.local` in this project and fill them in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ....(the anon public key)
SUPABASE_SERVICE_ROLE_KEY=eyJ....(the service_role key)
NEXT_PUBLIC_SITE_URL=http://localhost:3100
```

`SUPABASE_SERVICE_ROLE_KEY` is only used by the Paddle webhook and is never
sent to the browser. The Paddle keys can stay blank for now — billing runs in
a simulated "demo" mode until you add them (see `DEPLOY.md` Part 2).

## 5. Verify + run it

```
npm run verify   # confirms your Supabase URL, keys, and schema are wired right
npm run dev
```

`npm run verify` tells you instantly if a key is wrong or the schema isn't
loaded — fix any ✗ before deploying. Then open http://localhost:3100 →
**Get started** → create an account → you're in.

## 6. Deploy free (when ready)

See [`DEPLOY.md`](DEPLOY.md) for one-click Vercel deploy + how to start earning.
