"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createProgram, type ActionState } from "@/app/dashboard/actions";
import { PLATFORMS } from "@/lib/constants";

export default function ProgramForm({ atLimit }: { atLimit: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createProgram,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  if (atLimit) {
    return (
      <a
        href="/dashboard/billing"
        className="btn-ghost border-accent/40 text-accent"
      >
        Program limit reached — Upgrade
      </a>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        + Add program
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="card w-full space-y-3 p-5"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">Name *</label>
          <input name="name" required className="input" placeholder="Acme VDP" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Platform</label>
          <select name="platform" className="input" defaultValue="HackerOne">
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-muted">Program URL</label>
          <input
            name="url"
            className="input"
            placeholder="https://hackerone.com/acme"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Min bounty</label>
          <input
            name="min_bounty"
            type="number"
            className="input"
            placeholder="100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Max bounty</label>
          <input
            name="max_bounty"
            type="number"
            className="input"
            placeholder="10000"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-muted">Scope notes</label>
          <textarea
            name="scope"
            rows={2}
            className="input"
            placeholder="*.acme.com, mobile apps. Out: third-party SaaS."
          />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save program"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
