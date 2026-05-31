#!/usr/bin/env node
// One-shot, hands-off deployer for BountyDesk.
//
// Reads tokens from .env.deploy (gitignored):
//   SUPABASE_ACCESS_TOKEN  (https://supabase.com/dashboard/account/tokens)
//   VERCEL_TOKEN           (https://vercel.com/account/tokens)
// Then, with NO further input, it:
//   1. creates/reuses a Supabase project, waits until healthy
//   2. loads supabase/schema.sql, turns on instant signup (auto-confirm)
//   3. pulls the project URL + anon + service_role keys -> writes .env.local
//   4. links a Vercel project, sets env vars, deploys to production
//   5. points Supabase auth at the live URL and redeploys
//
// Creates only FREE-tier resources. Never touches Paddle / real money.
// Prints progress + the final live URL; never prints secret values.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SB_API = "https://api.supabase.com/v1";
const REGION = process.env.SUPABASE_REGION || "us-east-1";
const PROJECT_NAME = "bountydesk";

const log = (m) => console.log(`\n• ${m}`);
const die = (m) => {
  console.error(`\n✗ ${m}`);
  process.exit(1);
};

// ---- load .env.deploy -------------------------------------------------------
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
const SB_TOKEN = env.SUPABASE_ACCESS_TOKEN || process.env.SUPABASE_ACCESS_TOKEN;
const VC_TOKEN = env.VERCEL_TOKEN || process.env.VERCEL_TOKEN;

if (!SB_TOKEN) die("SUPABASE_ACCESS_TOKEN missing in .env.deploy");
if (!VC_TOKEN) die("VERCEL_TOKEN missing in .env.deploy");

// ---- supabase management API helper ----------------------------------------
async function sb(method, path, body) {
  const res = await fetch(`${SB_API}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${SB_TOKEN}`,
      "content-type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!res.ok) {
    throw new Error(
      `Supabase ${method} ${path} -> ${res.status}: ${
        typeof json === "string" ? json : JSON.stringify(json)
      }`,
    );
  }
  return json;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function provisionSupabase() {
  log("Supabase: finding your organization…");
  const orgs = await sb("GET", "/organizations");
  if (!orgs?.length) die("No Supabase organization found on this account.");
  const orgId = orgs[0].id;
  console.log(`  org: ${orgs[0].name}`);

  log("Supabase: checking for an existing bountydesk project…");
  const projects = await sb("GET", "/projects");
  let project = projects.find((p) => p.name === PROJECT_NAME);

  if (project) {
    console.log(`  reusing project ref ${project.id} (status ${project.status})`);
  } else {
    log("Supabase: creating a new project (free tier)…");
    const dbPass = randomBytes(24).toString("base64url");
    project = await sb("POST", "/projects", {
      name: PROJECT_NAME,
      organization_id: orgId,
      region: REGION,
      db_pass: dbPass,
    });
    console.log(`  created ref ${project.id}`);
  }

  const ref = project.id;

  log("Supabase: waiting until the database is healthy (can take ~2-4 min)…");
  const deadline = Date.now() + 8 * 60 * 1000;
  while (Date.now() < deadline) {
    const p = await sb("GET", `/projects/${ref}`);
    if (p.status === "ACTIVE_HEALTHY") {
      console.log("  healthy.");
      break;
    }
    process.stdout.write(`  status ${p.status}… `);
    await sleep(10000);
    if (Date.now() >= deadline) die("Timed out waiting for the project to become healthy.");
  }

  log("Supabase: loading schema.sql…");
  const schema = readFileSync(join(ROOT, "supabase", "schema.sql"), "utf8");
  await sb("POST", `/projects/${ref}/database/query`, { query: schema });
  console.log("  schema loaded.");

  log("Supabase: enabling instant signup (auto-confirm email)…");
  await sb("PATCH", `/projects/${ref}/config/auth`, { mailer_autoconfirm: true });

  log("Supabase: fetching API keys…");
  const keys = await sb("GET", `/projects/${ref}/api-keys?reveal=true`);
  const anon = keys.find((k) => k.name === "anon")?.api_key;
  const service = keys.find((k) => k.name === "service_role")?.api_key;
  if (!anon || !service) die("Could not read anon/service_role keys.");

  return { ref, url: `https://${ref}.supabase.co`, anon, service };
}

// ---- vercel CLI helper (token via env, never argv) --------------------------
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
    vc(`env rm ${name} production --yes`, { capture: true });
  } catch {
    /* not set yet */
  }
  vc(`env add ${name} production`, { input: value + "\n", capture: true });
  console.log(`  set ${name}`);
}

function deployProd() {
  const out = vc(`deploy --prod --yes`, { capture: true });
  const url = (out.match(/https:\/\/[^\s]+\.vercel\.app/g) || []).pop();
  if (!url) die("Could not parse the Vercel deployment URL.");
  return url;
}

async function main() {
  const supa = await provisionSupabase();

  log("Writing .env.local…");
  writeFileSync(
    join(ROOT, ".env.local"),
    [
      `NEXT_PUBLIC_SUPABASE_URL=${supa.url}`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=${supa.anon}`,
      `SUPABASE_SERVICE_ROLE_KEY=${supa.service}`,
      `NEXT_PUBLIC_SITE_URL=http://localhost:3100`,
      ``,
    ].join("\n"),
  );

  log("Vercel: linking project…");
  vc(`link --yes --project ${PROJECT_NAME}`, { capture: true });

  log("Vercel: setting environment variables…");
  setVercelEnv("NEXT_PUBLIC_SUPABASE_URL", supa.url);
  setVercelEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", supa.anon);
  setVercelEnv("SUPABASE_SERVICE_ROLE_KEY", supa.service);

  log("Vercel: first production deploy (provisional URL)…");
  // Temporary SITE_URL so the build has a value; corrected after we know the URL.
  setVercelEnv("NEXT_PUBLIC_SITE_URL", "https://" + PROJECT_NAME + ".vercel.app");
  let liveUrl = deployProd();
  console.log(`  deployed: ${liveUrl}`);

  log("Vercel: fixing NEXT_PUBLIC_SITE_URL to the real URL and redeploying…");
  setVercelEnv("NEXT_PUBLIC_SITE_URL", liveUrl);
  liveUrl = deployProd();

  log("Supabase: pointing auth at the live URL…");
  await sb("PATCH", `/projects/${supa.ref}/config/auth`, {
    site_url: liveUrl,
    uri_allow_list: `${liveUrl},${liveUrl}/**`,
  });

  console.log(`\n✅ LIVE: ${liveUrl}`);
  console.log("   Sign up there to confirm it works. Paddle stays in demo mode until you add keys.");
}

main().catch((e) => die(e.message));
