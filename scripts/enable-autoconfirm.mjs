#!/usr/bin/env node
// Enables INSTANT SIGNUP on the live Supabase project (turns OFF email
// confirmation) and points auth at the production URL.
//
// Why this is needed: with email confirmation ON, signups try to send a mail
// via Supabase's built-in sender, which is severely rate-limited and not meant
// for production — real users get stuck unconfirmed. BountyDesk is designed for
// instant signup, so we disable confirmation.
//
// This is a GoTrue (auth-service) config change — it is NOT reachable via SQL
// or the Supabase MCP connector, only via the Management API or the dashboard.
//
// Needs ONE credential in .env.deploy (gitignored, never printed):
//   SUPABASE_ACCESS_TOKEN  (https://supabase.com/dashboard/account/tokens)
// Then:  npm run enable:signup
//
// No-token alternative (dashboard, ~20s): Supabase → your project →
// Authentication → Providers → Email → turn OFF "Confirm email" → Save.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REF = "axvsnpjzaesgffoxhrmu";
const SITE = "https://bountydesk.vercel.app";

function loadEnvFile(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

const env = loadEnvFile(join(ROOT, ".env.deploy"));
const TOKEN = env.SUPABASE_ACCESS_TOKEN || process.env.SUPABASE_ACCESS_TOKEN;

if (!TOKEN) {
  console.error(
    "\n✗ SUPABASE_ACCESS_TOKEN missing.\n" +
      "  Token route: create one at https://supabase.com/dashboard/account/tokens,\n" +
      "  put it in .env.deploy as SUPABASE_ACCESS_TOKEN=..., then re-run.\n" +
      "  OR (no token) dashboard: Authentication → Providers → Email →\n" +
      "  turn OFF 'Confirm email' → Save.\n",
  );
  process.exit(1);
}

const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/config/auth`, {
  method: "PATCH",
  headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
  body: JSON.stringify({
    mailer_autoconfirm: true,
    site_url: SITE,
    uri_allow_list: `${SITE},${SITE}/**`,
  }),
});

const txt = await res.text();
if (!res.ok) {
  console.error(`\n✗ Management API ${res.status}: ${txt}\n`);
  process.exit(1);
}

console.log(`\n✅ Instant signup ENABLED (email confirmation off) and auth pointed at ${SITE}.`);
console.log("   Re-run the signup smoke test to confirm.\n");
