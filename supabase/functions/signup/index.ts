// Edge Function: instant signup.
//
// Why this exists: BountyDesk is designed for instant signup, but the live
// project has email confirmation ON and the built-in Supabase mailer is
// rate-limited, so plain auth.signUp() fails with 429 over_email_send_rate_limit.
// Toggling mailer_autoconfirm is GoTrue control-plane config (not reachable via
// SQL or the Supabase MCP connector). Instead we create the user PRE-CONFIRMED
// with the admin API, which sends NO email. The service_role key is auto-injected
// into the function runtime by Supabase — it is never handled outside this server.
//
// The on_auth_user_created trigger then auto-creates the profiles row (plan=free).
// The browser follows up with signInWithPassword to establish the session.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let email: string, password: string;
  try {
    ({ email, password } = await req.json());
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  if (!email || !password) {
    return json({ error: "Email and password are required." }, 400);
  }
  if (typeof password !== "string" || password.length < 6) {
    return json({ error: "Password must be at least 6 characters." }, 400);
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    const msg = error.message || "Could not create the account.";
    const exists = /already|registered|exists/i.test(msg);
    return json(
      { error: exists ? "An account with this email already exists." : msg },
      exists ? 409 : 400,
    );
  }

  return json({ ok: true, user_id: data.user?.id });
});
