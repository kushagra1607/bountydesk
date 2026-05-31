import Link from "next/link";
import { getAccount } from "@/lib/account";
import type { Submission } from "@/lib/types";
import { ACCEPTED_STATUSES, type Status } from "@/lib/constants";

function money(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default async function DashboardPage() {
  const { supabase, user } = await getAccount();

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const subs: Submission[] = data ?? [];

  const totalEarnings = subs.reduce((s, x) => s + Number(x.bounty_amount || 0), 0);
  const paidCount = subs.filter((x) => Number(x.bounty_amount) > 0).length;
  const accepted = subs.filter((x) =>
    ACCEPTED_STATUSES.includes(x.status as Status),
  ).length;
  const resolved = subs.filter((x) => x.status !== "Draft").length;
  const hitRate =
    resolved > 0 ? Math.round((accepted / resolved) * 100) : 0;

  // Earnings by month (last 6 months)
  const months: { label: string; total: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const total = subs
      .filter((x) => {
        const cd = new Date(x.submitted_at || x.created_at);
        return `${cd.getFullYear()}-${cd.getMonth()}` === key;
      })
      .reduce((s, x) => s + Number(x.bounty_amount || 0), 0);
    months.push({
      label: d.toLocaleString("en-US", { month: "short" }),
      total,
    });
  }
  const maxMonth = Math.max(1, ...months.map((m) => m.total));

  // Top vuln types by earnings
  const byVuln = new Map<string, number>();
  for (const s of subs) {
    byVuln.set(
      s.vuln_type,
      (byVuln.get(s.vuln_type) ?? 0) + Number(s.bounty_amount || 0),
    );
  }
  const topVulns = [...byVuln.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const stats = [
    { label: "Total earnings", value: money(totalEarnings) },
    { label: "Submissions", value: String(subs.length) },
    { label: "Paid bugs", value: String(paidCount) },
    { label: "Hit rate", value: `${hitRate}%` },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <Link href="/dashboard/submissions" className="btn-primary">
          + New submission
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-xs text-muted">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {subs.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="text-muted">
            No submissions yet. Add your first bug to start tracking earnings.
          </p>
          <Link
            href="/dashboard/submissions"
            className="btn-primary mt-4 inline-block"
          >
            Add a submission
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="card p-5">
            <h2 className="mb-4 text-sm font-semibold">
              Earnings — last 6 months
            </h2>
            <div className="flex h-44 items-end gap-3">
              {months.map((m) => (
                <div key={m.label} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t bg-accent/70"
                      style={{
                        height: `${(m.total / maxMonth) * 100}%`,
                        minHeight: m.total > 0 ? "4px" : "0",
                      }}
                      title={money(m.total)}
                    />
                  </div>
                  <span className="mt-2 text-[11px] text-muted">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-4 text-sm font-semibold">
              Top vuln types by payout
            </h2>
            {topVulns.every(([, v]) => v === 0) ? (
              <p className="text-sm text-muted">
                No payouts recorded yet. Set a bounty amount on resolved bugs.
              </p>
            ) : (
              <div className="space-y-3">
                {topVulns.map(([name, val]) => (
                  <div key={name}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="truncate">{name}</span>
                      <span className="text-muted">{money(val)}</span>
                    </div>
                    <div className="h-2 rounded bg-surface-2">
                      <div
                        className="h-2 rounded bg-accent/70"
                        style={{
                          width: `${
                            (val /
                              Math.max(1, ...topVulns.map(([, x]) => x))) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
