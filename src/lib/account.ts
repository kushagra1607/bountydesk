import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { PLAN_LIMITS, type Plan } from "@/lib/constants";

/**
 * Loads the signed-in user + their profile (plan). Redirects to /login
 * if there is no authenticated user. Use at the top of any app page.
 */
export async function getAccount() {
  // Before Supabase is configured, send users to /login which renders a
  // clear setup notice instead of throwing a 500.
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  // Safety net: if the trigger didn't create a profile, make one now.
  if (!profile) {
    await supabase
      .from("profiles")
      .insert({ id: user.id, email: user.email });
    profile = {
      id: user.id,
      email: user.email ?? null,
      plan: "free",
      paddle_customer_id: null,
      paddle_subscription_id: null,
      created_at: new Date().toISOString(),
    };
  }

  const plan: Plan = profile.plan === "pro" ? "pro" : "free";

  return { supabase, user, profile, plan, limits: PLAN_LIMITS[plan] };
}
