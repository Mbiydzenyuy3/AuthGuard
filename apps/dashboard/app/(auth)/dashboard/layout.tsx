import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background-light">
      <aside className="w-64 bg-primary text-white flex flex-col py-6 px-4">
        <h2 className="text-xl font-bold mb-8">DevGuard</h2>

        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="hover:bg-white/10 p-2 rounded">
            Dashboard
          </Link>

          <Link href="/dashboard/api-keys" className="hover:bg-white/10 p-2 rounded">
            API Keys
          </Link>

          <Link href="/dashboard/logs" className="hover:bg-white/10 p-2 rounded">
            Logs
          </Link>

          <Link href="/dashboard/settings" className="hover:bg-white/10 p-2 rounded">
            Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
