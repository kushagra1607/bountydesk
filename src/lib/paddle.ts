import { Environment, Paddle } from "@paddle/paddle-node-sdk";

// Real payments require all four keys. Missing any one => demo mode
// (simulated upgrade), so the product stays fully testable without Paddle.
export function isPaddleConfigured() {
  return Boolean(
    process.env.PADDLE_API_KEY &&
      process.env.PADDLE_WEBHOOK_SECRET &&
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      process.env.NEXT_PUBLIC_PADDLE_PRICE_ID,
  );
}

// Default to sandbox so a half-configured deploy can never take a real charge.
export function paddleClientEnv(): "sandbox" | "production" {
  return process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
    ? "production"
    : "sandbox";
}

let cached: Paddle | null = null;
export function getPaddle(): Paddle {
  if (!process.env.PADDLE_API_KEY) throw new Error("PADDLE_API_KEY is not set");
  if (!cached) {
    cached = new Paddle(process.env.PADDLE_API_KEY, {
      environment:
        paddleClientEnv() === "production"
          ? Environment.production
          : Environment.sandbox,
    });
  }
  return cached;
}
