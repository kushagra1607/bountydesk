// Creates the "BountyDesk Pro" product + $7/mo recurring price in Paddle and
// prints the price ID to drop into NEXT_PUBLIC_PADDLE_PRICE_ID. Never charges
// anyone — it only defines the catalog entry the checkout sells.
//
// Usage: put PADDLE_API_KEY (and NEXT_PUBLIC_PADDLE_ENV=sandbox|production) in
// .env.local or .env.deploy, then run:  npm run setup:paddle
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
  console.error("✗ PADDLE_API_KEY not found in .env.local or .env.deploy.");
  console.error(
    "  Get it from Paddle → Developer Tools → Authentication → API keys,",
  );
  console.error("  paste it into .env.local, then re-run: npm run setup:paddle");
  process.exit(1);
}

const isProd = process.env.NEXT_PUBLIC_PADDLE_ENV === "production";
const taxCategory = process.env.PADDLE_TAX_CATEGORY || "standard";
const paddle = new Paddle(apiKey, {
  environment: isProd ? Environment.production : Environment.sandbox,
});

console.log(
  `• Paddle ${isProd ? "PRODUCTION" : "sandbox"}: creating product + $7/mo price…`,
);

try {
  const product = await paddle.products.create({
    name: "BountyDesk Pro",
    taxCategory,
    description:
      "Unlimited submissions & programs, Markdown report export, full analytics history.",
  });
  const price = await paddle.prices.create({
    description: "BountyDesk Pro — monthly",
    productId: product.id,
    unitPrice: { amount: "700", currencyCode: "USD" },
    billingCycle: { interval: "month", frequency: 1 },
  });

  console.log("\n✅ Created in Paddle:");
  console.log(`   product:  ${product.id}`);
  console.log(`   price:    ${price.id}   ($7.00/mo USD)`);
  console.log("\nNext: set this in .env.local AND in Vercel env, then redeploy:");
  console.log(`   NEXT_PUBLIC_PADDLE_PRICE_ID=${price.id}`);
} catch (e) {
  const msg = e?.message || String(e);
  console.error("\n✗ Paddle API error:", msg);
  if (msg.toLowerCase().includes("tax")) {
    console.error(
      `  Tip: your account may not have the '${taxCategory}' tax category enabled.`,
    );
    console.error("  Re-run with: PADDLE_TAX_CATEGORY=standard npm run setup:paddle");
  }
  process.exit(1);
}
