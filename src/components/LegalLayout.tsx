import { type ReactNode } from "react";
import Link from "next/link";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-lg font-semibold"
          >
            <span className="text-emerald-400">~/</span>
            <span>bountydesk</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/login"
              className="rounded px-3 py-1.5 text-neutral-300 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded bg-emerald-500 px-3 py-1.5 font-medium text-neutral-950 hover:bg-emerald-400"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-neutral-500">Last updated: {updated}</p>
        <div className="mt-8 space-y-5 leading-relaxed text-neutral-300">
          {children}
        </div>
      </main>

      <footer className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 py-8 text-center text-sm text-neutral-500">
          <nav className="flex flex-wrap justify-center gap-4">
            <Link href="/pricing" className="hover:text-neutral-300">
              Pricing
            </Link>
            <Link href="/terms" className="hover:text-neutral-300">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-neutral-300">
              Privacy
            </Link>
            <Link href="/refund" className="hover:text-neutral-300">
              Refunds
            </Link>
          </nav>
          <p>BountyDesk — track more, write less, get paid faster.</p>
        </div>
      </footer>
    </div>
  );
}
