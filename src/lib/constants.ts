// Domain constants for BountyDesk.

export const PLATFORMS = [
  "HackerOne",
  "Bugcrowd",
  "Intigriti",
  "YesWeHack",
  "Synack",
  "Private / Direct",
  "Other",
] as const;
export type Platform = (typeof PLATFORMS)[number];

export const VULN_TYPES = [
  "XSS (Cross-Site Scripting)",
  "SQL Injection",
  "IDOR / BOLA",
  "SSRF",
  "RCE",
  "Authentication Bypass",
  "Broken Access Control",
  "CSRF",
  "Information Disclosure",
  "Open Redirect",
  "XXE",
  "Subdomain Takeover",
  "Business Logic",
  "Misconfiguration",
  "Other",
] as const;
export type VulnType = (typeof VULN_TYPES)[number];

export const SEVERITIES = ["Critical", "High", "Medium", "Low", "Info"] as const;
export type Severity = (typeof SEVERITIES)[number];

// CVSS v3.1 base-score bands used by the report builder severity helper.
export const SEVERITY_CVSS: Record<Severity, string> = {
  Critical: "9.0 – 10.0",
  High: "7.0 – 8.9",
  Medium: "4.0 – 6.9",
  Low: "0.1 – 3.9",
  Info: "0.0",
};

export const SEVERITY_COLOR: Record<Severity, string> = {
  Critical: "bg-red-500/15 text-red-300 border-red-500/30",
  High: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  Medium: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  Low: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Info: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
};

// The submission lifecycle, in pipeline order.
export const STATUSES = [
  "Draft",
  "Submitted",
  "Triaged",
  "Accepted",
  "Duplicate",
  "Informative",
  "Not Applicable",
  "Resolved",
  "Paid",
] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_COLOR: Record<Status, string> = {
  Draft: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  Submitted: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Triaged: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  Accepted: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Duplicate: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Informative: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  "Not Applicable": "bg-zinc-600/15 text-zinc-400 border-zinc-600/30",
  Resolved: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  Paid: "bg-green-500/15 text-green-300 border-green-500/30",
};

// Statuses that count as a positive (accepted) outcome for the hit-rate stat.
export const ACCEPTED_STATUSES: Status[] = [
  "Accepted",
  "Triaged",
  "Resolved",
  "Paid",
];

// Free vs Pro plan limits. This is the monetization boundary.
export const PLAN_LIMITS = {
  free: {
    maxSubmissions: 15,
    maxPrograms: 5,
    reportExport: false,
  },
  pro: {
    maxSubmissions: Infinity,
    maxPrograms: Infinity,
    reportExport: true,
  },
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

export const PRO_PRICE_USD = 7;
