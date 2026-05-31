"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSubmission,
  updateSubmission,
  deleteSubmission,
  type ActionState,
} from "@/app/dashboard/actions";
import {
  VULN_TYPES,
  SEVERITIES,
  STATUSES,
  SEVERITY_COLOR,
  STATUS_COLOR,
  type Severity,
  type Status,
} from "@/lib/constants";
import type { SubmissionWithProgram, Program } from "@/lib/types";

function Badge({ text, cls }: { text: string; cls: string }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>
      {text}
    </span>
  );
}

function Fields({
  programs,
  sub,
}: {
  programs: Program[];
  sub?: SubmissionWithProgram;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs text-muted">Title *</label>
        <input
          name="title"
          required
          defaultValue={sub?.title}
          className="input"
          placeholder="Stored XSS in profile bio"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Program</label>
        <select
          name="program_id"
          className="input"
          defaultValue={sub?.program_id ?? ""}
        >
          <option value="">— none —</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Vuln type</label>
        <select
          name="vuln_type"
          className="input"
          defaultValue={sub?.vuln_type ?? "Other"}
        >
          {VULN_TYPES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Severity</label>
        <select
          name="severity"
          className="input"
          defaultValue={sub?.severity ?? "Medium"}
        >
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Status</label>
        <select
          name="status"
          className="input"
          defaultValue={sub?.status ?? "Draft"}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Bounty amount</label>
        <input
          name="bounty_amount"
          type="number"
          step="0.01"
          defaultValue={sub?.bounty_amount ?? 0}
          className="input"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Currency</label>
        <input
          name="currency"
          defaultValue={sub?.currency ?? "USD"}
          className="input"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">
          Date submitted
        </label>
        <input
          name="submitted_at"
          type="date"
          defaultValue={sub?.submitted_at ?? ""}
          className="input"
        />
      </div>
      {sub && (
        <div>
          <label className="mb-1 block text-xs text-muted">
            Date resolved
          </label>
          <input
            name="resolved_at"
            type="date"
            defaultValue={sub?.resolved_at ?? ""}
            className="input"
          />
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs text-muted">
          Target / endpoint
        </label>
        <input
          name="target"
          defaultValue={sub?.target ?? ""}
          className="input"
          placeholder="https://app.acme.com/api/v2/users"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs text-muted">
          Notes / report draft
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={sub?.description ?? ""}
          className="input"
        />
      </div>
    </div>
  );
}

function CreateForm({
  programs,
  onDone,
}: {
  programs: Program[];
  onDone: () => void;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createSubmission,
    {},
  );
  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      onDone();
      router.refresh();
    }
  }, [state, onDone, router]);

  return (
    <form ref={formRef} action={action} className="card space-y-3 p-5">
      <Fields programs={programs} />
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <div className="flex gap-2">
        <button
          disabled={pending}
          className="btn-primary disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save submission"}
        </button>
        <button type="button" onClick={onDone} className="btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}

function EditForm({
  programs,
  sub,
  onDone,
}: {
  programs: Program[];
  sub: SubmissionWithProgram;
  onDone: () => void;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateSubmission,
    {},
  );
  useEffect(() => {
    if (state.ok) {
      onDone();
      router.refresh();
    }
  }, [state, onDone, router]);

  return (
    <form action={action} className="space-y-3 border-t border-border p-4">
      <input type="hidden" name="id" value={sub.id} />
      <Fields programs={programs} sub={sub} />
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <div className="flex gap-2">
        <button
          disabled={pending}
          className="btn-primary disabled:opacity-50"
        >
          {pending ? "Saving…" : "Update"}
        </button>
        <button type="button" onClick={onDone} className="btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function SubmissionsManager({
  submissions,
  programs,
  atLimit,
  used,
  limit,
}: {
  submissions: SubmissionWithProgram[];
  programs: Program[];
  atLimit: boolean;
  used: number;
  limit: string;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold">Submissions</h1>
        {atLimit ? (
          <a
            href="/dashboard/billing"
            className="btn-ghost border-accent/40 text-accent"
          >
            Limit reached — Upgrade
          </a>
        ) : (
          !adding && (
            <button
              onClick={() => setAdding(true)}
              className="btn-primary"
            >
              + New submission
            </button>
          )
        )}
      </div>
      <p className="mb-6 text-sm text-muted">
        {used} / {limit} submissions
      </p>

      {adding && (
        <div className="mb-6">
          <CreateForm
            programs={programs}
            onDone={() => setAdding(false)}
          />
        </div>
      )}

      {submissions.length === 0 && !adding ? (
        <div className="card p-10 text-center text-muted">
          No submissions yet. Log your first bug to start tracking.
        </div>
      ) : (
        <div className="space-y-2">
          {submissions.map((s) => (
            <div key={s.id} className="card overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{s.title}</p>
                  <p className="text-xs text-muted">
                    {s.programs?.name ?? "No program"} · {s.vuln_type}
                    {s.submitted_at ? ` · ${s.submitted_at}` : ""}
                  </p>
                </div>
                <Badge
                  text={s.severity}
                  cls={
                    SEVERITY_COLOR[s.severity as Severity] ??
                    SEVERITY_COLOR.Info
                  }
                />
                <Badge
                  text={s.status}
                  cls={
                    STATUS_COLOR[s.status as Status] ?? STATUS_COLOR.Draft
                  }
                />
                <span className="w-20 text-right text-sm tabular-nums">
                  {Number(s.bounty_amount) > 0
                    ? `$${Number(s.bounty_amount).toLocaleString()}`
                    : "—"}
                </span>
                <button
                  onClick={() =>
                    setEditId(editId === s.id ? null : s.id)
                  }
                  className="text-xs text-muted hover:text-foreground"
                >
                  {editId === s.id ? "Close" : "Edit"}
                </button>
                <form
                  action={async (fd) => {
                    await deleteSubmission(fd);
                    router.refresh();
                  }}
                >
                  <input type="hidden" name="id" value={s.id} />
                  <button className="text-xs text-muted hover:text-red-400">
                    Delete
                  </button>
                </form>
              </div>
              {editId === s.id && (
                <EditForm
                  programs={programs}
                  sub={s}
                  onDone={() => setEditId(null)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
