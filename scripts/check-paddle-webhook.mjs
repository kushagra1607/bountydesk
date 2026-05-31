// READ-ONLY diagnostic: checks whether PADDLE_API_KEY can read notification
// settings (i.e. has Notifications scope) and lists any existing webhook
// destinations. Creates/changes nothing. Never prints secrets.
import { readFileSync } from "node:fs";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";

function loadEnv(file) {
  let txt;
  try {
    txt = readFileSync(file, "utf8");
  } catch {
    return;
  }
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv(".env.local");
loadEnv(".env.deploy");

const apiKey = process.env.PADDLE_API_KEY;
if (!apiKey) {
  console.error("RESULT: NO_API_KEY");
  process.exit(1);
}

const isProd = process.env.NEXT_PUBLIC_PADDLE_ENV === "production";
const dest =
  process.env.PADDLE_WEBHOOK_URL ||
  "https://bountydesk.vercel.app/api/paddle/webhook";
const paddle = new Paddle(apiKey, {
  environment: isProd ? Environment.production : Environment.sandbox,
});

try {
  const existing = await paddle.notificationSettings.list();
  console.log(`RESULT: OK (env=${isProd ? "production" : "sandbox"})`);
  console.log(`KEY_HAS_NOTIFICATION_SCOPE: yes`);
  console.log(`EXISTING_DESTINATIONS: ${existing.length}`);
  for (const s of existing) {
    const matches = s.destination === dest;
    // Only safe, non-secret fields:
    console.log(
      `  - id=${s.id} active=${s.active} type=${s.type} matchesTarget=${matches} hasSecretInList=${Boolean(s.endpointSecretKey)} dest=${s.destination}`,
    );
  }
  const target = existing.find((s) => s.destination === dest);
  if (target) {
    console.log(`TARGET_DESTINATION: EXISTS (id=${target.id})`);
  } else {
    console.log(`TARGET_DESTINATION: MISSING`);
  }
} catch (e) {
  const msg = e?.message || String(e);
  console.error(`RESULT: ERROR`);
  console.error(`MESSAGE: ${msg}`);
  // Heuristic: scope/permission failures vs other errors
  if (/403|forbidden|permission|scope|unauthor/i.test(msg)) {
    console.error(`LIKELY_CAUSE: API key lacks Notifications scope`);
  }
  process.exit(1);
}
