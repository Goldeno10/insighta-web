import { cookies } from "next/headers";
import Link from "next/link";
import { User, Globe, Calendar, ArrowLeft } from "lucide-react";

async function getProfileDetail(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("No access token found");
  }

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://hng-14-internship.vercel.app";

  const res = await fetch(`${BACKEND_URL}/api/profiles/${id}`, {
    headers: {
      "X-API-Version": "1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Profile not found or unauthorized");
  }

  return res.json();
}

export default async function ProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const resolvedParams = await params;
    const response = await getProfileDetail(resolvedParams.id);
    const profile = response.data;

    return (
      <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-10">
        <Link
          href="/profiles"
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-800/80 transition hover:text-teal-950"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to profiles
        </Link>

        <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-sm shadow-teal-900/5">
          <div className="border-b border-teal-100 bg-gradient-to-r from-teal-50 to-white px-8 py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-xl font-bold text-white">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-teal-950">
                  {profile.name}
                </h1>
                <p className="text-sm text-teal-800/65">ID: {profile.id}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex gap-3">
                <User
                  className="mt-0.5 shrink-0 text-teal-500"
                  size={20}
                  aria-hidden
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700/70">
                    Gender
                  </p>
                  <p className="mt-1 text-sm text-teal-950 capitalize">
                    {profile.gender} (
                    {(profile.gender_probability * 100).toFixed(0)}% confidence)
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar
                  className="mt-0.5 shrink-0 text-teal-500"
                  size={20}
                  aria-hidden
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700/70">
                    Age & classification
                  </p>
                  <p className="mt-1 text-sm text-teal-950">
                    {profile.age} years old ({profile.age_group})
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-3">
                <Globe
                  className="mt-0.5 shrink-0 text-teal-500"
                  size={20}
                  aria-hidden
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700/70">
                    Origin
                  </p>
                  <p className="mt-1 text-sm text-teal-950">
                    {profile.country_name} ({profile.country_id})
                  </p>
                  <p className="mt-1 text-xs text-teal-800/55">
                    {(profile.country_probability * 100).toFixed(0)}% probability
                    mapping
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700/70">
                  Profile created
                </p>
                <p className="mt-1 text-sm text-teal-950">
                  {new Date(profile.created_at).toLocaleString()}
                </p>
              </div>
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
          <h2 className="text-lg font-semibold text-teal-950">
            Profile not found
          </h2>
          <p className="mt-2 text-sm text-teal-800/70">
            The requested demographic profile does not exist or you do not have
            permission to view it.
          </p>
          <Link
            href="/profiles"
            className="mt-6 inline-block rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            Back to profiles
          </Link>
        </div>
      </div>
    );
  }
}
