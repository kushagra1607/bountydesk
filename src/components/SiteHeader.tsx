import Link from "next/link";

// Shared top nav for public marketing + legal pages.
export default function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-lg font-bold">
          <span className="text-accent">~/</span>bountydesk
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
