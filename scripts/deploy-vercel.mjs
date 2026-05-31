#!/usr/bin/env node
// Token-only Vercel deploy for BountyDesk.
//
// The Supabase backend is ALREADY provisioned (values live in .env.local).
// This script does ONLY the public Vercel deploy of the local code, which
// structurally requires authenticating to your Vercel account — the Vercel
// MCP connector exposes no way to upload local files (verified: deploy_to_vercel
// takes zero parameters; there is no create_deployment / git-source / upload tool).
//
// Provide ONE credential in .env.deploy (gitignored, never printed):
//   VERCEL_TOKEN   (create at https://vercel.com/account/tokens, scope: Full Account)
// Then:  npm run deploy:vercel
//
// It links/creates the "bountydesk" Vercel project, copies the env vars from
// .env.local into production, deploys, fixes NEXT_PUBLIC_SITE_URL to the real
// URL, and redeploys. Free-tier only. Never touches Paddle / real money.

import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT_NAME = "bountydesk";

const log = (m) => console.log(`\n• ${m}`);
const die = (m) => {
  console.error(`\n✗ ${m}`);
  process.exit(1);
};

function loadEnvFile(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

const deployEnv = loadEnvFile(join(ROOT, ".env.deploy"));
const VC_TOKEN = deployEnv.VERCEL_TOKEN || process.env.VERCEL_TOKEN;
// Vercel CLI refuses to pick a default team in non-interactive mode, so the
// scope (team slug) must be passed explicitly on every command.
const SCOPE = deployEnv.VERCEL_SCOPE || process.env.VERCEL_SCOPE || "kushagra-kartikey-s-projects";
if (!VC_TOKEN)
  die(
    "VERCEL_TOKEN missing.\n" +
      "  1. Create a token at https://vercel.com/account/tokens (Scope: Full Account)\n" +
      "  2. Put it in .env.deploy:  VERCEL_TOKEN=xxxxxxxx\n" +
      "  3. Re-run: npm run deploy:vercel\n" +
      "  (The token stays in the local gitignored file and is never printed.)",
  );

const local = loadEnvFile(join(ROOT, ".env.local"));
const SUPA_URL = local.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_ANON = local.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPA_SERVICE = local.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPA_URL || !SUPA_ANON)
  die("NEXT_PUBLIC_SUPABASE_URL / ANON_KEY missing in .env.local — run `npm run verify` first.");

function vc(cmd, opts = {}) {
  return execSync(`vercel ${cmd}`, {
    cwd: ROOT,
    env: { ...process.env, VERCEL_TOKEN: VC_TOKEN },
    stdio: opts.capture ? ["pipe", "pipe", "inherit"] : "inherit",
    input: opts.input,
    encoding: "utf8",
  });
}

function setVercelEnv(name, value) {
  try {
    vc(`env rm ${name} production --yes --scope ${SCOPE}`, { capture: true });
  } catch {
    /* not set yet */
  }
  vc(`env add ${name} production --scope ${SCOPE}`, { input: value + "\n", capture: true });
  console.log(`  set ${name}`);
}

function deployProd() {
  const out = vc(`deploy --prod --yes --scope ${SCOPE}`, { capture: true });
  const url = (out.match(/https:\/\/[^\s]+\.vercel\.app/g) || []).pop();
  if (!url) die("Could not parse the Vercel deployment URL.");
  return url;
}

log("Vercel: linking (creates the project if it doesn't exist)…");
try {
  vc(`link --yes --project ${PROJECT_NAME} --scope ${SCOPE}`, { capture: true });
} catch (e) {
  die(`vercel link failed — is VERCEL_TOKEN valid? (${e.message})`);
}

log("Vercel: copying env vars from .env.local into production…");
setVercelEnv("NEXT_PUBLIC_SUPABASE_URL", SUPA_URL);
setVercelEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", SUPA_ANON);
if (SUPA_SERVICE) setVercelEnv("SUPABASE_SERVICE_ROLE_KEY", SUPA_SERVICE);
else console.log("  (SUPABASE_SERVICE_ROLE_KEY blank — fine; only needed for live Paddle payments later.)");

// Copy Paddle keys through when present (blank = demo mode stays on).
for (const key of [
  "NEXT_PUBLIC_PADDLE_ENV",
  "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN",
  "NEXT_PUBLIC_PADDLE_PRICE_ID",
  "PADDLE_API_KEY",
  "PADDLE_WEBHOOK_SECRET",
]) {
  if (local[key]) setVercelEnv(key, local[key]);
}

log("Vercel: first production deploy (provisional URL)…");
setVercelEnv("NEXT_PUBLIC_SITE_URL", `https://${PROJECT_NAME}.vercel.app`);
let liveUrl = deployProd();
console.log(`  deployed: ${liveUrl}`);

log("Vercel: fixing NEXT_PUBLIC_SITE_URL to the real URL and redeploying…");
setVercelEnv("NEXT_PUBLIC_SITE_URL", liveUrl);
liveUrl = deployProd();

console.log(`\n✅ LIVE: ${liveUrl}`);
console.log("   Next: point Supabase auth at this URL (I can do that via the connector — no token).");
console.log("   Paddle stays in demo mode until you add your Paddle keys to .env.local + redeploy.");
