import { cookies } from "next/headers";
import Link from "next/link";
import { Database } from "lucide-react";
import { RefreshButton } from "@/components/refresh-button";

async function getProfiles(page: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("No access token found");
  }
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://hng-14-internship.vercel.app";

  const res = await fetch(
    `${BACKEND_URL}/api/profiles?page=${page}&limit=10`,
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

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  try {
    const resolvedParams = await searchParams;
    const page = resolvedParams.page || "1";

    const response = await getProfiles(page);
    const profiles = response.data;
    const pagination = response.pagination;

    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-teal-950">
              Profiles
            </h1>
            <p className="text-sm text-teal-800/70">
              Paginated seed profiles from the demographic database.
            </p>
          </header>
          <RefreshButton className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-medium text-teal-900 shadow-sm transition hover:border-teal-300 hover:bg-teal-50" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-sm shadow-teal-900/5">
          <div className="flex items-center gap-3 border-b border-teal-100 px-6 py-4">
            <Database className="text-teal-600" size={20} aria-hidden />
            <h2 className="text-sm font-semibold text-teal-900">
              Seed profiles database
            </h2>
          </div>

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
                {profiles.map((profile: {
                  id: string;
                  name: string;
                  gender: string;
                  age: number;
                  country_name: string;
                  country_id: string;
                }) => (
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
                    <td className="px-6 py-3.5 capitalize">{profile.gender}</td>
                    <td className="px-6 py-3.5 tabular-nums">{profile.age}</td>
                    <td className="px-6 py-3.5">
                      {profile.country_name} ({profile.country_id})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                  href={`/profiles?page=${Number(page) - 1}`}
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
                  href={`/profiles?page=${Number(page) + 1}`}
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
        </div>
      </div>
    );
  } catch {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-8 text-center shadow-sm">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-lg text-red-600"
            aria-hidden
          >
            ⚠️
          </div>
          <h2 className="text-lg font-semibold text-teal-950">Access denied</h2>
          <p className="mt-2 text-sm text-teal-800/70">
            Your session has expired or you do not have permission to view this
            portal.
          </p>
          <a
            href="/"
            className="mt-6 inline-block rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            Back to login
          </a>
        </div>
      </div>
    );
  }
}
