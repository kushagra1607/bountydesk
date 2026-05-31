"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/submissions", label: "Submissions" },
  { href: "/dashboard/programs", label: "Programs" },
  { href: "/dashboard/reports", label: "Report Builder" },
  { href: "/dashboard/billing", label: "Billing" },
];

export default function AppNav({ plan }: { plan: "free" | "pro" }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((l) => {
        const active =
          l.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-surface-2 text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
      <div className="mt-3 px-3">
        <span
          className={`inline-block rounded-full border px-2 py-0.5 text-[11px] ${
            plan === "pro"
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-border text-muted"
          }`}
        >
          {plan === "pro" ? "PRO" : "FREE plan"}
        </span>
      </div>
    </nav>
  );
}
