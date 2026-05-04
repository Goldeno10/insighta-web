import { cookies } from "next/headers";
import Link from "next/link";
import { Database, Cpu } from "lucide-react";

async function getMetrics() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profiles?page=1&limit=10`,
    {
      headers: {
        "X-API-Version": "1",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export default async function Dashboard() {
  try {
    const response = await getMetrics();
    const totalProfiles = response.pagination.total;

    return (
      <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-10">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-teal-950 md:text-3xl">
            System dashboard
          </h1>
          <p className="text-sm text-teal-800/70">
            High-level metrics and quick entry points into the dataset.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm shadow-teal-900/5">
            <div className="mb-4 flex items-center gap-2 text-teal-700">
              <Database size={20} aria-hidden />
              <h2 className="text-xs font-semibold uppercase tracking-wide text-teal-800/80">
                Total profiles
              </h2>
            </div>
            <p className="text-4xl font-bold tabular-nums text-teal-600">
              {totalProfiles}
            </p>
            <p className="mt-2 text-xs text-teal-800/60">
              Indexed seed records available via API v1.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm shadow-teal-900/5">
            <div className="mb-4 flex items-center gap-2 text-teal-700">
              <Cpu size={20} aria-hidden />
              <h2 className="text-xs font-semibold uppercase tracking-wide text-teal-800/80">
                Active APIs
              </h2>
            </div>
            <p className="text-4xl font-bold tabular-nums text-teal-600">3</p>
            <p className="mt-2 text-xs text-teal-800/60">
              Profiles, search, and user endpoints under versioned headers.
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-teal-300/80 bg-teal-50/50 p-6 sm:col-span-2 lg:col-span-1">
            <h2 className="text-sm font-semibold text-teal-900">Next steps</h2>
            <p className="mt-2 text-sm text-teal-800/75">
              Browse paginated profiles or run a filtered search across the
              corpus.
            </p>
            <Link
              href="/profiles"
              className="mt-4 inline-flex items-center text-sm font-medium text-teal-700 underline decoration-teal-400/60 underline-offset-4 hover:text-teal-900"
            >
              Open profiles list →
            </Link>
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm font-medium text-red-700">Access denied</p>
      </div>
    );
  }
}
