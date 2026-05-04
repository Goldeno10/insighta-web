import { cookies } from "next/headers";
import Link from "next/link";
import { Search, Database } from "lucide-react";
import { RefreshButton } from "@/components/refresh-button";

async function searchProfiles(query: string, page: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("No access token found");
  }

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://hng-14-internship.vercel.app";

  const res = await fetch(
    `${BACKEND_URL}/api/profiles/search?q=${encodeURIComponent(query)}&page=${page}&limit=10`,
    {
      headers: {
        "X-API-Version": "1",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Session expired or unauthorized");
  }

  return res.json();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const page = resolvedParams.page || "1";

  let profiles: Array<{
    id: string;
    name: string;
    gender: string;
    age: number;
    country_name: string;
    country_id: string;
  }> = [];
  let pagination = null;
  let error: string | null = null;

  if (query.trim()) {
    try {
      const response = await searchProfiles(query, page);
      profiles = response.data || [];
      pagination = response.pagination;
    } catch (err) {
      error = err instanceof Error ? err.message : "Search failed";
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-teal-950 md:text-3xl">
            Search profiles
          </h1>
          <p className="text-sm text-teal-800/70">
            Filter by name, country, age, and other demographic fields.
          </p>
        </header>
        <RefreshButton className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-medium text-teal-900 shadow-sm transition hover:border-teal-300 hover:bg-teal-50" />
      </div>

      <form
        method="GET"
        className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-500/70"
            size={20}
            aria-hidden
          />
          <input
            type="text"
            name="q"
            placeholder="Search by name, country, age…"
            defaultValue={query}
            className="w-full rounded-xl border border-teal-200/90 bg-white py-3.5 pl-11 pr-4 text-sm text-teal-950 shadow-sm outline-none ring-teal-500/30 transition placeholder:text-teal-800/40 focus:border-teal-400 focus:ring-2"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-teal-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          Search
        </button>
      </form>

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      )}

      {query.trim() && (
        <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-sm shadow-teal-900/5">
          <div className="flex flex-wrap items-center gap-3 border-b border-teal-100 px-6 py-4">
            <Database className="text-teal-600" size={20} aria-hidden />
            <h2 className="text-sm font-semibold text-teal-900">
              Results for &ldquo;{query}&rdquo;{" "}
              <span className="font-normal text-teal-800/60">
                ({profiles.length} on this page)
              </span>
            </h2>
          </div>

          {profiles.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-teal-100 bg-teal-50/80 text-xs font-semibold uppercase tracking-wide text-teal-800/80">
                    <tr>
                      <th className="px-6 py-3.5">Name</th>
                      <th className="px-6 py-3.5">Gender</th>
                      <th className="px-6 py-3.5">Age</th>
                      <th className="px-6 py-3.5">Country</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-100/80 text-teal-900">
                    {profiles.map((profile) => (
                      <tr
                        key={profile.id}
                        className="transition hover:bg-teal-50/60"
                      >
                        <td className="px-6 py-3.5 font-medium">
                          <Link
                            href={`/profiles/${profile.id}`}
                            className="text-teal-800 underline decoration-teal-300/70 underline-offset-2 hover:text-teal-950"
                          >
                            {profile.name}
                          </Link>
                        </td>
                        <td className="px-6 py-3.5 capitalize">
                          {profile.gender}
                        </td>
                        <td className="px-6 py-3.5 tabular-nums">
                          {profile.age}
                        </td>
                        <td className="px-6 py-3.5">
                          {profile.country_name} ({profile.country_id})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && (
                <div className="flex flex-col gap-3 border-t border-teal-100 bg-teal-50/50 px-4 py-4 text-sm text-teal-800/80 sm:flex-row sm:items-center sm:justify-between">
                  <p>
                    Page{" "}
                    <span className="font-medium text-teal-900">
                      {pagination.current_page}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-teal-900">
                      {pagination.total_pages}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    {pagination.current_page > 1 ? (
                      <Link
                        href={`/search?q=${encodeURIComponent(query)}&page=${Number(page) - 1}`}
                        className="rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 transition hover:bg-teal-50"
                      >
                        Previous
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-lg border border-teal-100 bg-teal-50/80 px-4 py-2 text-sm text-teal-400"
                      >
                        Previous
                      </button>
                    )}
                    {pagination.has_next ? (
                      <Link
                        href={`/search?q=${encodeURIComponent(query)}&page=${Number(page) + 1}`}
                        className="rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 transition hover:bg-teal-50"
                      >
                        Next
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-lg border border-teal-100 bg-teal-50/80 px-4 py-2 text-sm text-teal-400"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="px-6 py-14 text-center">
              <p className="font-medium text-teal-900">No profiles found</p>
              <p className="mt-1 text-sm text-teal-800/60">
                Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>
      )}

      {!query.trim() && (
        <div className="rounded-2xl border border-dashed border-teal-300/80 bg-teal-50/40 px-6 py-14 text-center">
          <Search
            className="mx-auto mb-4 text-teal-500/50"
            size={48}
            aria-hidden
          />
          <h2 className="text-lg font-semibold text-teal-950">
            Start searching
          </h2>
          <p className="mt-2 text-sm text-teal-800/65">
            Enter a query above to search the profile index.
          </p>
        </div>
      )}
    </div>
  );
}
