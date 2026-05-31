// Creates (or reuses) a Paddle webhook destination pointing at the live
// /api/paddle/webhook route and writes its signing secret straight into
// .env.local (PADDLE_WEBHOOK_SECRET). The secret is never printed — it goes
// only into the gitignored env file.
//
// Usage: PADDLE_API_KEY + NEXT_PUBLIC_PADDLE_ENV in .env.local, then:
//   npm run setup:paddle:webhook
// Override the destination with PADDLE_WEBHOOK_URL=... if your live URL differs.
import { readFileSync, writeFileSync } from "node:fs";
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
  console.error("✗ PADDLE_API_KEY not found in .env.local or .env.deploy.");
  process.exit(1);
}

const isProd = process.env.NEXT_PUBLIC_PADDLE_ENV === "production";
const dest =
  process.env.PADDLE_WEBHOOK_URL ||
  "https://bountydesk.vercel.app/api/paddle/webhook";
const paddle = new Paddle(apiKey, {
  environment: isProd ? Environment.production : Environment.sandbox,
});

const subscribedEvents = [
  "subscription.activated",
  "subscription.canceled",
  "subscription.created",
  "subscription.updated",
];

console.log(
  `• Paddle ${isProd ? "PRODUCTION" : "sandbox"}: ensuring webhook -> ${dest}`,
);

try {
  let setting;
  const existing = await paddle.notificationSettings.list();
  const found = existing.find((s) => s.destination === dest);
  if (found && found.endpointSecretKey) {
    setting = found;
    console.log(`• Reusing existing destination ${found.id}`);
  } else {
    setting = await paddle.notificationSettings.create({
      description: "BountyDesk plan sync",
      destination: dest,
      type: "url",
      subscribedEvents,
    });
    console.log(`• Created destination ${setting.id}`);
  }

  const secret = setting.endpointSecretKey;
  if (!secret) {
    console.error(
      "✗ Paddle did not return an endpointSecretKey. Create the destination in the dashboard (Notifications) and paste its secret into .env.local manually.",
    );
    process.exit(2);
  }

  const envPath = ".env.local";
  let txt = readFileSync(envPath, "utf8");
  if (/^PADDLE_WEBHOOK_SECRET=.*$/m.test(txt)) {
    txt = txt.replace(/^PADDLE_WEBHOOK_SECRET=.*$/m, `PADDLE_WEBHOOK_SECRET=${secret}`);
  } else {
    txt += `${txt.endsWith("\n") ? "" : "\n"}PADDLE_WEBHOOK_SECRET=${secret}\n`;
  }
  writeFileSync(envPath, txt);
  console.log(
    `\n✅ Wrote PADDLE_WEBHOOK_SECRET to .env.local (length ${secret.length}, value not shown).`,
  );
  console.log(`   Destination id: ${setting.id}`);
  console.log(`   Subscribed: ${subscribedEvents.join(", ")}`);
} catch (e) {
  console.error("\n✗ Paddle API error:", e?.message || String(e));
  process.exit(1);
}
