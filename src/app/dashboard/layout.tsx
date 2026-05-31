import Link from "next/link";
import { getAccount } from "@/lib/account";
import AppNav from "@/components/AppNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, plan } = await getAccount();

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl">
      <aside className="hidden w-56 shrink-0 flex-col justify-between border-r border-border p-4 sm:flex">
        <div>
          <Link
            href="/dashboard"
            className="mb-6 block font-mono text-base font-bold"
          >
            <span className="text-accent">~/</span>bountydesk
          </Link>
          <AppNav plan={plan} />
        </div>
        <div className="border-t border-border pt-3">
          <p className="truncate px-3 text-xs text-muted" title={user.email ?? ""}>
            {user.email}
          </p>
          <form action="/auth/signout" method="post">
            <button className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:text-foreground">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-5 py-6 sm:px-8">
        {/* Mobile top bar */}
        <div className="mb-4 flex items-center justify-between sm:hidden">
          <Link href="/dashboard" className="font-mono font-bold">
            <span className="text-accent">~/</span>bountydesk
          </Link>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-muted">Sign out</button>
          </form>
        </div>
        {children}
      </main>
    </div>
  );
}
