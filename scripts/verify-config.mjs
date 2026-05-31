// Preflight check for BountyDesk config.
//
// Verifies .env.local is wired correctly BEFORE you deploy, so you get
// instant feedback instead of debugging a broken production site.
// Checks: Supabase URL reachable + schema loaded (profiles table exists),
// required keys present, and reports whether Paddle is in real or demo mode.
//
// Usage:  node scripts/verify-config.mjs

import fs from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const raw of fs.readFileSync(p, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

const pass = (m) => console.log(`✓ ${m}`);
const fail = (m) => console.log(`✗ ${m}`);
const info = (m) => console.log(`• ${m}`);

function present(v) {
  return Boolean(v && !v.includes("YOUR-") && !v.endsWith("xxx") && v !== "");
}

async function main() {
  loadEnvLocal();
  let ok = true;

  console.log("\nBountyDesk config preflight\n---------------------------");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!present(url) || !present(anon)) {
    fail("Supabase URL / anon key missing in .env.local (see SETUP.md steps 1–4).");
    ok = false;
  } else {
    try {
      const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/profiles?select=id&limit=1`, {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
      });
      if (res.status === 200) {
        pass("Supabase reachable and 'profiles' table exists (schema loaded).");
      } else if (res.status === 404 || res.status === 400) {
        fail(`Supabase reachable but schema not loaded (status ${res.status}). Run supabase/schema.sql in the SQL Editor.`);
        ok = false;
      } else if (res.status === 401) {
        fail("Supabase rejected the anon key (401). Re-copy NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        ok = false;
      } else {
        info(`Supabase responded with status ${res.status} — check the URL/keys.`);
      }
    } catch (e) {
      fail(`Could not reach Supabase URL (${e?.message || e}). Check NEXT_PUBLIC_SUPABASE_URL.`);
      ok = false;
    }
  }

  if (present(service)) pass("Service-role key present (Paddle webhook can update plans).");
  else fail("SUPABASE_SERVICE_ROLE_KEY missing — needed for the Paddle webhook to flip users to Pro.");

  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (present(site)) pass(`Site URL set: ${site}`);
  else info("NEXT_PUBLIC_SITE_URL not set (defaults to request origin).");

  const apiKey = process.env.PADDLE_API_KEY;
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;
  const whsec = process.env.PADDLE_WEBHOOK_SECRET;
  const prod = process.env.NEXT_PUBLIC_PADDLE_ENV === "production";
  if (present(apiKey) && present(clientToken) && present(priceId)) {
    pass(`Paddle configured (${prod ? "PRODUCTION" : "sandbox"} mode) — real payments ON.`);
    if (!present(whsec)) info("PADDLE_WEBHOOK_SECRET not set — add your Notifications destination secret, or Pro won't activate after payment.");
  } else {
    info("Paddle not configured → app runs in demo upgrade mode. Fine for validating demand; run `npm run setup:paddle` when ready to charge.");
  }

  console.log("---------------------------");
  if (ok) console.log("Preflight: READY to run/deploy.\n");
  else {
    console.log("Preflight: NOT ready — fix the ✗ items above.\n");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("verify-config failed:", e?.message || e);
  process.exit(1);
});
