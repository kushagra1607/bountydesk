import { getAccount } from "@/lib/account";
import type { SubmissionWithProgram, Program } from "@/lib/types";
import SubmissionsManager from "@/components/SubmissionsManager";

export default async function SubmissionsPage() {
  const { supabase, user, plan, limits } = await getAccount();

  const [{ data: subs }, { data: progs }] = await Promise.all([
    supabase
      .from("submissions")
      .select("*, programs(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("programs")
      .select("*")
      .eq("user_id", user.id)
      .order("name"),
  ]);

  const submissions = (subs ?? []) as SubmissionWithProgram[];
  const programs = (progs ?? []) as Program[];
  const atLimit =
    plan === "free" && submissions.length >= limits.maxSubmissions;

  return (
    <SubmissionsManager
      submissions={submissions}
      programs={programs}
      atLimit={atLimit}
      used={submissions.length}
      limit={
        plan === "free" ? String(limits.maxSubmissions) : "∞"
      }
    />
  );
}
