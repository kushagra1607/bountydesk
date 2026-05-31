"use client";

import { useMemo, useState } from "react";
import {
  SEVERITIES,
  VULN_TYPES,
  SEVERITY_CVSS,
  type Severity,
} from "@/lib/constants";

type Picker = { id: string; title: string; data: Partial<Fields> };
type Fields = {
  title: string;
  severity: Severity;
  vuln: string;
  target: string;
  summary: string;
  steps: string;
  impact: string;
  poc: string;
  remediation: string;
  references: string;
};

const EMPTY: Fields = {
  title: "",
  severity: "Medium",
  vuln: "XSS (Cross-Site Scripting)",
  target: "",
  summary: "",
  steps: "",
  impact: "",
  poc: "",
  remediation: "",
  references: "",
};

function buildMarkdown(f: Fields): string {
  const lines: string[] = [];
  lines.push(`# ${f.title || "Untitled vulnerability"}`);
  lines.push("");
  lines.push(`**Severity:** ${f.severity} (CVSS ${SEVERITY_CVSS[f.severity]})`);
  lines.push(`**Vulnerability type:** ${f.vuln}`);
  if (f.target) lines.push(`**Affected asset:** ${f.target}`);
  lines.push("");
  lines.push("## Summary");
  lines.push(f.summary || "_Describe the issue in one or two sentences._");
  lines.push("");
  lines.push("## Steps to Reproduce");
  lines.push(
    f.steps
      ? f.steps
          .split("\n")
          .filter(Boolean)
          .map((s, i) => `${i + 1}. ${s.replace(/^\d+[.)]\s*/, "")}`)
          .join("\n")
      : "1. _Step one_\n2. _Step two_",
  );
  lines.push("");
  lines.push("## Impact");
  lines.push(f.impact || "_What can an attacker achieve with this?_");
  lines.push("");
  lines.push("## Proof of Concept");
  lines.push(f.poc ? "```\n" + f.poc + "\n```" : "_Payload / request / screenshot reference._");
  lines.push("");
  lines.push("## Remediation");
  lines.push(f.remediation || "_Recommended fix._");
  if (f.references.trim()) {
    lines.push("");
    lines.push("## References");
    lines.push(
      f.references
        .split("\n")
        .filter(Boolean)
        .map((r) => `- ${r}`)
        .join("\n"),
    );
  }
  lines.push("");
  lines.push("---");
  lines.push("_Report drafted with BountyDesk._");
  return lines.join("\n");
}

export default function ReportBuilder({
  canExport,
  pickers,
}: {
  canExport: boolean;
  pickers: Picker[];
}) {
  const [f, setF] = useState<Fields>(EMPTY);
  const [copied, setCopied] = useState(false);
  const md = useMemo(() => buildMarkdown(f), [f]);

  function set<K extends keyof Fields>(k: K, v: Fields[K]) {
    setF((p) => ({ ...p, [k]: v }));
  }

  function prefill(id: string) {
    const p = pickers.find((x) => x.id === id);
    if (!p) return;
    setF({ ...EMPTY, ...p.data, title: p.title });
  }

  async function copy() {
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function download() {
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download =
      (f.title || "vulnerability-report")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + ".md";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const field = "input";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Report Builder</h1>
        {pickers.length > 0 && (
          <select
            className="input max-w-xs"
            defaultValue=""
            onChange={(e) => prefill(e.target.value)}
          >
            <option value="">Prefill from a submission…</option>
            {pickers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Inputs */}
        <div className="card space-y-3 p-5">
          <div>
            <label className="mb-1 block text-xs text-muted">Title</label>
            <input
              className={field}
              value={f.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Stored XSS in profile bio field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted">
                Severity
              </label>
              <select
                className={field}
                value={f.severity}
                onChange={(e) =>
                  set("severity", e.target.value as Severity)
                }
              >
                {SEVERITIES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">
                Vuln type
              </label>
              <select
                className={field}
                value={f.vuln}
                onChange={(e) => set("vuln", e.target.value)}
              >
                {VULN_TYPES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">
              Affected asset / endpoint
            </label>
            <input
              className={field}
              value={f.target}
              onChange={(e) => set("target", e.target.value)}
              placeholder="https://app.acme.com/settings/profile"
            />
          </div>
          {(
            [
              ["summary", "Summary", 2],
              ["steps", "Steps to reproduce (one per line)", 4],
              ["impact", "Impact", 2],
              ["poc", "Proof of concept (payload / request)", 3],
              ["remediation", "Remediation", 2],
              ["references", "References (one URL per line)", 2],
            ] as const
          ).map(([k, label, rows]) => (
            <div key={k}>
              <label className="mb-1 block text-xs text-muted">
                {label}
              </label>
              <textarea
                className={field}
                rows={rows}
                value={f[k]}
                onChange={(e) => set(k, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="card flex flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Markdown</h2>
            <div className="flex gap-2">
              <button onClick={copy} className="btn-ghost text-xs">
                {copied ? "Copied!" : "Copy"}
              </button>
              {canExport ? (
                <button
                  onClick={download}
                  className="btn-primary text-xs"
                >
                  Download .md
                </button>
              ) : (
                <a
                  href="/dashboard/billing"
                  className="btn-ghost border-accent/40 text-xs text-accent"
                  title="Pro feature"
                >
                  Export .md (Pro)
                </a>
              )}
            </div>
          </div>
          <pre className="flex-1 overflow-auto whitespace-pre-wrap rounded-lg bg-surface-2 p-4 font-mono text-xs leading-relaxed">
            {md}
          </pre>
        </div>
      </div>
    </div>
  );
}
