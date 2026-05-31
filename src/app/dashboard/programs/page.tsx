import { getAccount } from "@/lib/account";
import type { Program } from "@/lib/types";
import { deleteProgram } from "@/app/dashboard/actions";
import ProgramForm from "@/components/ProgramForm";

export default async function ProgramsPage() {
  const { supabase, user, plan, limits } = await getAccount();

  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const programs: Program[] = data ?? [];
  const atLimit =
    plan === "free" && programs.length >= limits.maxPrograms;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold">Programs</h1>
        <ProgramForm atLimit={atLimit} />
      </div>
      <p className="mb-6 text-sm text-muted">
        {programs.length}
        {plan === "free" ? ` / ${limits.maxPrograms}` : ""} programs tracked
      </p>

      {programs.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          No programs yet. Add the bug bounty programs you actively hunt.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {programs.map((p) => (
            <div key={p.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted">{p.platform}</p>
                </div>
                <form action={deleteProgram}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    className="text-xs text-muted hover:text-red-400"
                    title="Delete program"
                  >
                    Delete
                  </button>
                </form>
              </div>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block truncate text-xs text-accent"
                >
                  {p.url}
                </a>
              )}
              {(p.min_bounty || p.max_bounty) && (
                <p className="mt-2 text-xs text-muted">
                  Bounty: ${p.min_bounty ?? "?"} – ${p.max_bounty ?? "?"}
                </p>
              )}
              {p.scope && (
                <p className="mt-2 line-clamp-3 text-xs text-muted">
                  {p.scope}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
