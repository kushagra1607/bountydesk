import { getAccount } from "@/lib/account";
import type { Submission } from "@/lib/types";
import ReportBuilder from "@/components/ReportBuilder";

export default async function ReportsPage() {
  const { supabase, user, limits } = await getAccount();

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const pickers = (data ?? []).map((s: Submission) => ({
    id: s.id,
    title: s.title,
    data: {
      severity: (s.severity as never) ?? "Medium",
      vuln: s.vuln_type ?? "Other",
      target: s.target ?? "",
      summary: s.description ?? "",
    },
  }));

  return <ReportBuilder canExport={limits.reportExport} pickers={pickers} />;
}
