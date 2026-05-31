"use server";

import { revalidatePath } from "next/cache";
import { getAccount } from "@/lib/account";

export type ActionState = { error?: string; ok?: boolean };

function str(v: FormDataEntryValue | null) {
  const s = (v ?? "").toString().trim();
  return s.length ? s : null;
}
function num(v: FormDataEntryValue | null) {
  const n = parseFloat((v ?? "").toString());
  return Number.isFinite(n) ? n : null;
}

// ----------------------------- Programs ------------------------------------

export async function createProgram(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user, plan, limits } = await getAccount();

  const { count } = await supabase
    .from("programs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (plan === "free" && (count ?? 0) >= limits.maxPrograms) {
    return {
      error: `Free plan is limited to ${limits.maxPrograms} programs. Upgrade to Pro for unlimited.`,
    };
  }

  const name = str(formData.get("name"));
  if (!name) return { error: "Program name is required." };

  const { error } = await supabase.from("programs").insert({
    user_id: user.id,
    name,
    platform: str(formData.get("platform")) ?? "Other",
    url: str(formData.get("url")),
    scope: str(formData.get("scope")),
    min_bounty: num(formData.get("min_bounty")),
    max_bounty: num(formData.get("max_bounty")),
    notes: str(formData.get("notes")),
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/programs");
  return { ok: true };
}

export async function deleteProgram(formData: FormData) {
  const { supabase, user } = await getAccount();
  const id = str(formData.get("id"));
  if (id) {
    await supabase
      .from("programs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
  }
  revalidatePath("/dashboard/programs");
}

// --------------------------- Submissions -----------------------------------

export async function createSubmission(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user, plan, limits } = await getAccount();

  const { count } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (plan === "free" && (count ?? 0) >= limits.maxSubmissions) {
    return {
      error: `Free plan is limited to ${limits.maxSubmissions} submissions. Upgrade to Pro for unlimited tracking.`,
    };
  }

  const title = str(formData.get("title"));
  if (!title) return { error: "Title is required." };

  const { error } = await supabase.from("submissions").insert({
    user_id: user.id,
    title,
    program_id: str(formData.get("program_id")),
    vuln_type: str(formData.get("vuln_type")) ?? "Other",
    severity: str(formData.get("severity")) ?? "Medium",
    status: str(formData.get("status")) ?? "Draft",
    bounty_amount: num(formData.get("bounty_amount")) ?? 0,
    currency: str(formData.get("currency")) ?? "USD",
    target: str(formData.get("target")),
    description: str(formData.get("description")),
    submitted_at: str(formData.get("submitted_at")),
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/submissions");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateSubmission(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await getAccount();
  const id = str(formData.get("id"));
  if (!id) return { error: "Missing submission id." };

  const title = str(formData.get("title"));
  if (!title) return { error: "Title is required." };

  const { error } = await supabase
    .from("submissions")
    .update({
      title,
      program_id: str(formData.get("program_id")),
      vuln_type: str(formData.get("vuln_type")) ?? "Other",
      severity: str(formData.get("severity")) ?? "Medium",
      status: str(formData.get("status")) ?? "Draft",
      bounty_amount: num(formData.get("bounty_amount")) ?? 0,
      currency: str(formData.get("currency")) ?? "USD",
      target: str(formData.get("target")),
      description: str(formData.get("description")),
      submitted_at: str(formData.get("submitted_at")),
      resolved_at: str(formData.get("resolved_at")),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/submissions");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteSubmission(formData: FormData) {
  const { supabase, user } = await getAccount();
  const id = str(formData.get("id"));
  if (id) {
    await supabase
      .from("submissions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
  }
  revalidatePath("/dashboard/submissions");
  revalidatePath("/dashboard");
}

// ------------------------------ Billing ------------------------------------
// NOTE: The previous demo-mode `setPlan` action was removed for security.
// It let any authenticated user upgrade themselves to Pro for free.
// Real billing is now handled exclusively by the Paddle webhook
// (src/app/api/paddle/webhook/route.ts), which uses the service_role client
// and verifies Paddle's HMAC signature on every event.
